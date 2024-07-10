import { HttpClient } from "./../http/HttpClient";
import {
  AccountGateway,
  InputCreateAccount,
  OutputCreateAccount,
  OutputGetByAccountId,
} from "../../application/gateway/AccountGateway";

export class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async createAccount(
    account: InputCreateAccount
  ): Promise<OutputCreateAccount> {
    return await this.httpClient.post(
      "http://localhost:3000/create_account",
      account
    );
  }

  async getByAccountId(accountId: string): Promise<OutputGetByAccountId> {
    return await this.httpClient.get(
      `http://localhost:3000/accounts/${accountId}`
    );
  }
}
