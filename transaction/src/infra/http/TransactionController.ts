import { CreateWallet } from "../../application/usecase/CreateWallet";
import { DepositAmount } from "../../application/usecase/DepositAmount";
import { GetTransaction } from "../../application/usecase/GetTransaction";
import { GetWallet } from "../../application/usecase/GetWallet";
import { TransferAmount } from "../../application/usecase/TransferAmount";
import { WithdrawAmount } from "../../application/usecase/WithdrawAmount";
import { HttpServer } from "./../../../../account/src/infra/http/HttpServer";

export class TransactionController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createWallet: CreateWallet,
    readonly depositAmount: DepositAmount,
    readonly withdrawAmount: WithdrawAmount,
    readonly transferAmount: TransferAmount,
    readonly getWallet: GetWallet,
    readonly getTransaction: GetTransaction
  ) {
    httpServer.register(
      "post",
      "/create_wallet",
      async (params: any, body: any) => {
        return await createWallet.execute(body);
      }
    );

    httpServer.register("post", "/deposit", async (params: any, body: any) => {
      return await depositAmount.execute({
        walletId: body.walletId,
        amount: parseFloat(body.amount),
      });
    });

    httpServer.register("post", "/withdraw", async (params: any, body: any) => {
      return await withdrawAmount.execute({
        walletId: body.walletId,
        amount: parseFloat(body.amount),
      });
    });

    httpServer.register("post", "/transfer", async (params: any, body: any) => {
      return await transferAmount.execute({
        payerId: body.payerId,
        payeeId: body.payeeId,
        amount: parseFloat(body.amount),
      });
    });

    httpServer.register(
      "get",
      "/wallets/:accountId",
      async (params: any, body: any) => {
        return await getWallet.execute({
          accountId: params.accountId,
        });
      }
    );

    httpServer.register(
      "get",
      "/transactions/:transactionId",
      async (params: any, body: any) => {
        return await getTransaction.execute({
          transactionId: params.transactionId,
        });
      }
    );
  }
}
