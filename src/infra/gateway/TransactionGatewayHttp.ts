import { TransactionGateway } from "../../application/gateway/TransactionGateway";
import { HttpClient } from "../http/HttpClient";

export class TransactionGatewayHttp implements TransactionGateway {
  constructor(readonly httpClient: HttpClient) {}

  async authorizeTransaction(): Promise<{
    status: string;
    data: { authorization: boolean };
  }> {
    return await this.httpClient.get(
      "https://util.devi.tools/api/v2/authorize"
    );
  }
}
