import { TransactionRepositoryMemory } from "../test/repository/TransactionRepositoryMemory";
import { CreateTransaction } from "./application/usecase/CreateTransaction";
import { GetTransaction } from "./application/usecase/GetTransaction";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { TransactionController } from "./infra/http/TransactionController";

const httpServer = new ExpressAdapter();
const transactionRepository = new TransactionRepositoryMemory();
const createTransaction = new CreateTransaction(transactionRepository);
const getTransaction = new GetTransaction(transactionRepository);
new TransactionController(httpServer, createTransaction, getTransaction);
httpServer.listen(3001);
