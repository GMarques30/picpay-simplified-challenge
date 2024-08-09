import { GetTransaction } from "./application/usecase/GetTransaction";
import { ProcessTransaction } from "./application/usecase/ProcessTransaction";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { TransactionController } from "./infra/http/TransactionController";
import { AuthorizeGatewayHttp } from "./infra/gateway/AuthorizeGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { QueueController } from "./infra/queue/QueueController";
import { TransactionRepositoryDatabase } from "./infra/repository/TransactionRepositoryDatabase";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import "dotenv/config";

(async () => {
  const httpClient = new AxiosAdapter();
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const connection = new PgPromiseAdapter();
  const transactionRepository = new TransactionRepositoryDatabase(connection);
  const authorizeGateway = new AuthorizeGatewayHttp(httpClient);
  const getTransaction = new GetTransaction(transactionRepository);
  const processTransaction = new ProcessTransaction(
    transactionRepository,
    authorizeGateway,
    queue
  );
  new QueueController(queue, processTransaction);
  new TransactionController(httpServer, getTransaction);
  httpServer.listen(Number(process.env.PORT));
})();
