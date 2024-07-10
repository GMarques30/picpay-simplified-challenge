import { TransactionGateway } from "../../application/gateway/TransactionGateway";
import { HttpClient } from "../http/HttpClient";

export class TransactionGatewayHttp implements TransactionGateway {
  constructor(readonly httpClient: HttpClient) {}

  async authorize(): Promise<void> {
    const response = await this.httpClient.get(
      "https://util.devi.tools/api/v2/authorize"
    );
    if (response.status === "fail") throw new Error("Unauthorized transaction");
  }
}
