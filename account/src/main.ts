import { AccountRepositoryMemory } from "../test/repository/AccountRepositoryMemory";
import { CreateAccount } from "./application/usecase/CreateAccount";
import { GetAccount } from "./application/usecase/GetAccount";
import { AccountController } from "./infra/http/AccountController";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
const accountRepository = new AccountRepositoryMemory();
const createAccount = new CreateAccount(accountRepository);
const getAccount = new GetAccount(accountRepository);
new AccountController(httpServer, createAccount, getAccount);
httpServer.listen(3000);
