import { AxiosAdapter, HttpClient } from "./../../infra/http/HttpClient";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { TransactionGatewayHttp } from "../../infra/gateway/TransactionGatewayHttp";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionRepository } from "../repository/TransactionRepository";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateUser } from "./CreateUser";
import { CreateWallet } from "./CreateWallet";
import { DepositAmount } from "./DepositAmount";
import { GetTransaction } from "./GetTransaction";
import { TransferAmount } from "./TransferAmount";
import { WithdrawAmount } from "./WithdrawAmount";

let HttpClient: HttpClient;
let transactionGateway: TransactionGateway;
let userRepository: UserRepository;
let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createUser: CreateUser;
let createWallet: CreateWallet;
let depositAmount: DepositAmount;
let withdrawAmount: WithdrawAmount;
let transferAmount: TransferAmount;
let sut: GetTransaction;

beforeEach(async () => {
  HttpClient = new AxiosAdapter();
  transactionGateway = new TransactionGatewayHttp(HttpClient);
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createUser = new CreateUser(userRepository);
  createWallet = new CreateWallet(walletRepository, userRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  withdrawAmount = new WithdrawAmount(walletRepository, transactionRepository);
  transferAmount = new TransferAmount(
    walletRepository,
    userRepository,
    transactionRepository,
    transactionGateway
  );
  sut = new GetTransaction(transactionRepository);
});

test("Deve ser possivel obter uma transaction do tipo deposit", async () => {
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
  expect(outputCreateUser.userId).toBeDefined();
  const inputCreateWallet = {
    userId: outputCreateUser.userId,
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  const outputDepositAmount = await depositAmount.execute(inputDepositAmount);
  expect(outputDepositAmount.transactionId).toBeDefined();
  const inputGetTransaction = {
    transactionId: outputDepositAmount.transactionId,
  };
  const outputGetTransaction = await sut.execute(inputGetTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputDepositAmount.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputDepositAmount.walletId);
  expect(outputGetTransaction.payeeId).toBe(inputDepositAmount.walletId);
  expect(outputGetTransaction.amount).toBe(inputDepositAmount.amount);
  expect(outputGetTransaction.status).toBe("deposit");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel obter uma transaction do tipo withdraw", async () => {
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
  expect(outputCreateUser.userId).toBeDefined();
  const inputCreateWallet = {
    userId: outputCreateUser.userId,
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  const outputDepositAmount = await depositAmount.execute(inputDepositAmount);
  expect(outputDepositAmount.transactionId).toBeDefined();
  const inputWithdrawAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 50,
  };
  const outputWithdrawAmount = await withdrawAmount.execute(
    inputWithdrawAmount
  );
  expect(outputWithdrawAmount.transactionId).toBeDefined();
  const inputGetTransaction = {
    transactionId: outputWithdrawAmount.transactionId,
  };

  const outputGetTransaction = await sut.execute(inputGetTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputWithdrawAmount.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputWithdrawAmount.walletId);
  expect(outputGetTransaction.payeeId).toBe(inputWithdrawAmount.walletId);
  expect(outputGetTransaction.amount).toBe(inputWithdrawAmount.amount);
  expect(outputGetTransaction.status).toBe("withdraw");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});
