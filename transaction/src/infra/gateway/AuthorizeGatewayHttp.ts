import {
  AuthorizeGateway,
  Output,
} from "../../application/gateway/AuthorizeGateway";
import { HttpClient } from "../http/HttpClient";

export class AuthorizeGatewayHttp implements AuthorizeGateway {
  constructor(readonly httpClient: HttpClient) {}

  async authorize(): Promise<Output> {
    const response = await this.httpClient.get(
      "https://util.devi.tools/api/v2/authorize"
    );
    let status = "rejected";
    if (response.data.authorization) {
      status = "approved";
    }
    return {
      status,
    };
  }
}
