export interface Queue {
  connect(): Promise<void>;
  close(): Promise<void>;
  publish(exchange: string, data: any): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
  setup(exchange: string, queue: string): Promise<void>;
}
