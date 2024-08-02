import { Retry } from "../../application/retry/Retry";

export class RetryImpl implements Retry {
  constructor(private maxRetries: number, private retriesDelay: number) {}

  async retry(callback: () => Promise<any>): Promise<any> {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        return await callback();
      } catch (err: any) {
        console.log("Erro");
        retries++;
        await new Promise((resolve) => setTimeout(resolve, this.retriesDelay));
      }
    }
    throw new Error("Maximum number of attempts exceeded");
  }
}
