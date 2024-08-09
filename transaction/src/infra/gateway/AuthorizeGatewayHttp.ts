import {
  AuthorizeGateway,
  Output,
} from "../../application/gateway/AuthorizeGateway";
import { HttpClient } from "../http/HttpClient";

export class AuthorizeGatewayHttp implements AuthorizeGateway {
  constructor(readonly httpClient: HttpClient) {}

  async authorize(): Promise<Output> {
    let status = "rejected";
    try {
      const response = await this.httpClient.get(
        process.env.AUTHORIZE_API_URL!
      );
      if (response.data.authorization) {
        status = "approved";
      }
      return {
        status,
      };
    } catch (err: any) {
      return {
        status,
      };
    }
  }
}
