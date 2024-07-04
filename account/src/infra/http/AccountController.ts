import { CreateAccount } from "../../application/usecase/CreateAccount";
import { GetAccount } from "../../application/usecase/GetAccount";
import { HttpServer } from "./HttpServer";

export class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createAccount: CreateAccount,
    readonly getAccount: GetAccount
  ) {
    httpServer.register(
      "post",
      "/create_account",
      async (params: any, body: any) => {
        return await createAccount.execute(body);
      }
    );

    httpServer.register(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        return await getAccount.execute({
          accountId: params.accountId,
        });
      }
    );
  }
}
