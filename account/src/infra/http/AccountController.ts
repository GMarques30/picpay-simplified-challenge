import { WithdrawAmount } from "./../../application/usecase/WithdrawAmount";
import { CreateAccount } from "../../application/usecase/CreateAccount";
import { DepositAmount } from "../../application/usecase/DepositAmount";
import { GetAccount } from "../../application/usecase/GetAccount";
import { TransferAmount } from "../../application/usecase/TransferAmount";
import { HttpServer } from "./HttpServer";

export class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createAccount: CreateAccount,
    readonly depositAmount: DepositAmount,
    readonly getAccount: GetAccount,
    readonly transferAmount: TransferAmount,
    readonly withdrawAmount: WithdrawAmount
  ) {
    httpServer.register(
      "post",
      "/create_account",
      async (params: any, body: any) => {
        return await createAccount.execute({
          name: body.name,
          document: body.document,
          email: body.email,
          password: body.password,
        });
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

    httpServer.register("post", "/transfer", async (params: any, body: any) => {
      await transferAmount.execute({
        payerId: body.payerId,
        payeeId: body.payeeId,
        amount: parseFloat(body.amount),
      });
    });

    httpServer.register("post", "/withdraw", async (params: any, body: any) => {
      await withdrawAmount.execute({
        accountId: body.accountId,
        amount: parseFloat(body.amount),
      });
    });

    httpServer.register("post", "/deposit", async (params: any, body: any) => {
      await depositAmount.execute({
        accountId: body.accountId,
        amount: parseFloat(body.amount),
      });
    });
  }
}
