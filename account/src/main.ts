import { AccountRepositoryMemory } from "../test/repository/AccountRepositoryMemory";
import { CreateAccount } from "./application/usecase/CreateAccount";
import { GetAccount } from "./application/usecase/GetAccount";
import { TransactionGatewayHttp } from "./infra/gateway/TransactionGatewayHttp";
import { AccountController } from "./infra/http/AccountController";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
const httpClient = new AxiosAdapter();
const transactionGateway = new TransactionGatewayHttp(httpClient);
const accountRepository = new AccountRepositoryMemory();
const createAccount = new CreateAccount(accountRepository, transactionGateway);
const getAccount = new GetAccount(accountRepository);
new AccountController(httpServer, createAccount, getAccount);
httpServer.listen(3000);
