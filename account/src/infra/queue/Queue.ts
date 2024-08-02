import { Queue } from "../../application/queue/queue";
import amqp, { Connection, Channel } from "amqplib";

export class RabbitMQAdapter implements Queue {
  private connection!: Connection;
  private channel!: Channel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
  }

  async close(): Promise<void> {
    this.connection.close();
  }

  async setup(exchange: string, queue: string): Promise<void> {
    await this.channel.assertExchange(exchange, "direct", { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, "");
  }

  async publish(exchange: string, data: any): Promise<void> {
    this.channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
  }

  async consume(queue: string, callback: Function): Promise<void> {
    this.channel.consume(queue, async (message: any) => {
      const input = JSON.parse(message.content.toString());
      await callback(input);
      this.channel.ack(message);
    });
  }
}
