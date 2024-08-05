import { GetTransaction } from "../../application/usecase/GetTransaction";
import { HttpServer } from "./HttpServer";

export class TransactionController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getTransaction: GetTransaction
  ) {
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
