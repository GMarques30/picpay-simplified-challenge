import { CreateTransaction } from "../../application/usecase/CreateTransaction";
import { GetTransaction } from "../../application/usecase/GetTransaction";
import { HttpServer } from "./../../../../account/src/infra/http/HttpServer";

export class TransactionController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createTransaction: CreateTransaction,
    readonly getTransaction: GetTransaction
  ) {
    httpServer.register(
      "post",
      "/create_transaction",
      async (params: any, body: any) => {
        return await createTransaction.execute(body);
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
