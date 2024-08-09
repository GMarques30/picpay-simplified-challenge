import { CancelTransfer } from "./application/usecase/CancelTransfer";
import { CancelWithdraw } from "./application/usecase/CancelWithdraw";
import { CancelDeposit } from "./application/usecase/CancelDeposit";
import { CreateAccount } from "./application/usecase/CreateAccount";
import { DepositAmount } from "./application/usecase/DepositAmount";
import { GetAccount } from "./application/usecase/GetAccount";
import { TransferAmount } from "./application/usecase/TransferAmount";
import { WithdrawAmount } from "./application/usecase/WithdrawAmount";
import { AccountController } from "./infra/http/AccountController";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { QueueController } from "./infra/queue/QueueController";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepositoryDatabase";
import {
  PgPromiseAdapter,
  PgPromiseAdapterUoW,
} from "./infra/database/DatabaseConnection";
import "dotenv/config";

(async () => {
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const connection = new PgPromiseAdapter();
  const connectionUoW = new PgPromiseAdapterUoW();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const accountRepositoryUoW = new AccountRepositoryDatabase(connectionUoW);
  const createAccount = new CreateAccount(accountRepository);
  const getAccount = new GetAccount(accountRepository);
  const depositAmount = new DepositAmount(accountRepository, queue);
  const withdrawAmount = new WithdrawAmount(accountRepository, queue);
  const transferAmount = new TransferAmount(accountRepositoryUoW, queue);
  const cancelDeposit = new CancelDeposit(accountRepository);
  const cancelWithdraw = new CancelWithdraw(accountRepository);
  const cancelTransfer = new CancelTransfer(accountRepositoryUoW);
  new QueueController(queue, cancelDeposit, cancelWithdraw, cancelTransfer);
  new AccountController(
    httpServer,
    createAccount,
    depositAmount,
    getAccount,
    transferAmount,
    withdrawAmount
  );
  httpServer.listen(Number(process.env.PORT));
})();
