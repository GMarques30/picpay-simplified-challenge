import { TransactionGateway } from "../../application/gateway/TransactionGateway";
import { HttpClient } from "../http/HttpClient";

export class TransactionGatewayHttp implements TransactionGateway {
  constructor(readonly httpClient: HttpClient) {}

  async createWallet(accountId: string): Promise<void> {
    await this.httpClient.post("http://localhost:3001/create_wallet", {
      accountId,
    });
  }
}
