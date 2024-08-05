import { AxiosError } from "axios";
import { Queue } from "../../application/queue/Queue";
import amqp, { Connection, Channel } from "amqplib";

export class RabbitMQAdapter implements Queue {
  private connection!: Connection;
  private channel!: Channel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://rabbitmq");
    this.channel = await this.connection.createChannel();
  }

  async close(): Promise<void> {
    this.connection.close();
  }

  async publish(exchange: string, data: any): Promise<void> {
    this.channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
  }

  async consume(queue: string, callback: Function): Promise<void> {
    this.channel.consume(queue, async (message: any) => {
      try {
        const input = JSON.parse(message.content.toString());
        await callback(input);
        this.channel.ack(message);
      } catch (err: any) {
        this.channel.nack(message);
      }
    });
  }
}
