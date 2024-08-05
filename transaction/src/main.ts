import { TransactionRepositoryMemory } from "../test/repository/TransactionRepositoryMemory";
import { GetTransaction } from "./application/usecase/GetTransaction";
import { ProcessTransaction } from "./application/usecase/ProcessTransaction";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { TransactionController } from "./infra/http/TransactionController";
import { AuthorizeGatewayHttp } from "./infra/gateway/AuthorizeGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { QueueController } from "./infra/queue/QueueController";

(async () => {
  const httpClient = new AxiosAdapter();
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  // await queue.setup(
  //   "transactionApproved",
  //   "transactionApproved.sendNotification"
  // );
  // await queue.setup(
  //   "transactionRejected",
  //   "transactionRejected.sendNotification"
  // );
  // await queue.setup(
  //   "transactionRejected",
  //   "transactionRejected.cancelTransaction"
  // );
  const transactionRepository = new TransactionRepositoryMemory();
  const authorizeGateway = new AuthorizeGatewayHttp(httpClient);
  const getTransaction = new GetTransaction(transactionRepository);
  const processTransaction = new ProcessTransaction(
    transactionRepository,
    authorizeGateway,
    queue
  );
  new QueueController(queue, processTransaction);
  new TransactionController(httpServer, getTransaction);
  httpServer.listen(3001);
})();
