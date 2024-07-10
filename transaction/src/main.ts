import { TransactionRepositoryMemory } from "../test/repository/TransactionRepositoryMemory";
import { WalletRepositoryMemory } from "../test/repository/WalletRepositoryMemory";
import { CreateWallet } from "./application/usecase/CreateWallet";
import { DepositAmount } from "./application/usecase/DepositAmount";
import { GetTransaction } from "./application/usecase/GetTransaction";
import { GetWallet } from "./application/usecase/GetWallet";
import { TransferAmount } from "./application/usecase/TransferAmount";
import { WithdrawAmount } from "./application/usecase/WithdrawAmount";
import { AccountGatewayHttp } from "./infra/gateway/AccountGatewayHttp";
import { NotificationGatewayHttp } from "./infra/gateway/NotificationGatewayHttp";
import { TransactionGatewayHttp } from "./infra/gateway/TransactionGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { TransactionController } from "./infra/http/TransactionController";

const httpServer = new ExpressAdapter();
const httpClient = new AxiosAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);
const transactionGateway = new TransactionGatewayHttp(httpClient);
const notificationGateway = new NotificationGatewayHttp(httpClient);
const walletRepository = new WalletRepositoryMemory();
const transactionRepository = new TransactionRepositoryMemory();
const createWallet = new CreateWallet(walletRepository);
const depositAmount = new DepositAmount(
  walletRepository,
  transactionRepository
);
const withdrawAmount = new WithdrawAmount(
  walletRepository,
  transactionRepository
);
const transferAmount = new TransferAmount(
  walletRepository,
  transactionRepository,
  transactionGateway,
  notificationGateway,
  accountGateway
);
const getWallet = new GetWallet(walletRepository);
const getTransaction = new GetTransaction(transactionRepository);
new TransactionController(
  httpServer,
  createWallet,
  depositAmount,
  withdrawAmount,
  transferAmount,
  getWallet,
  getTransaction
);
httpServer.listen(3001);
