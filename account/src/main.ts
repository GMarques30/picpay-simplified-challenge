import { CancelTransfer } from "./application/usecase/CancelTransfer";
import { CancelWithdraw } from "./application/usecase/CancelWithdraw";
import { CancelDeposit } from "./application/usecase/CancelDeposit";
import { AccountRepositoryMemory } from "../test/repository/AccountRepositoryMemory";
import { CreateAccount } from "./application/usecase/CreateAccount";
import { DepositAmount } from "./application/usecase/DepositAmount";
import { GetAccount } from "./application/usecase/GetAccount";
import { TransferAmount } from "./application/usecase/TransferAmount";
import { WithdrawAmount } from "./application/usecase/WithdrawAmount";
import { AccountController } from "./infra/http/AccountController";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { QueueController } from "./infra/queue/QueueController";

(async () => {
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.setup("depositPlaced", "depositPlaced.processTransaction");
  await queue.setup("withdrawPlaced", "withdrawPlaced.processTransaction");
  await queue.setup("transferPlaced", "transferPlaced.processTransaction");
  const accountRepository = new AccountRepositoryMemory();
  const createAccount = new CreateAccount(accountRepository);
  const getAccount = new GetAccount(accountRepository);
  const depositAmount = new DepositAmount(accountRepository, queue);
  const withdrawAmount = new WithdrawAmount(accountRepository, queue);
  const transferAmount = new TransferAmount(accountRepository, queue);
  const cancelDeposit = new CancelDeposit(accountRepository);
  const cancelWithdraw = new CancelWithdraw(accountRepository);
  const cancelTransfer = new CancelTransfer(accountRepository);
  new QueueController(queue, cancelDeposit, cancelWithdraw, cancelTransfer);
  new AccountController(
    httpServer,
    createAccount,
    depositAmount,
    getAccount,
    transferAmount,
    withdrawAmount
  );
  httpServer.listen(3000);
})();
