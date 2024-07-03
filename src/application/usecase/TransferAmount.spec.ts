import { TransactionGateway } from "./../gateway/TransactionGateway";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { TransactionRepository } from "../repository/TransactionRepository";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateUser } from "./CreateUser";
import { CreateWallet } from "./CreateWallet";
import { DepositAmount } from "./DepositAmount";
import { GetWallet } from "./GetWallet";
import { TransferAmount } from "./TransferAmount";
import { GetTransaction } from "./GetTransaction";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { NotificationGatewayFake } from "../../../test/gateway/NotificationGatewayFake";
import { TransactionGatewayFake } from "../../../test/gateway/TransactionGatewayFake";

jest.mock("./../gateway/TransactionGateway");
jest.mock("../gateway/NotificationGateway");

let userRepository: UserRepository;
let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let transactionGateway: TransactionGateway;
let notificationGateway: NotificationGateway;
let notifySpy: jest.SpyInstance;
let createUser: CreateUser;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let depositAmount: DepositAmount;
let getTransaction: GetTransaction;
let sut: TransferAmount;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  transactionGateway = {
    authorize: jest.fn(),
  };
  notificationGateway = new NotificationGatewayFake();
  notifySpy = jest.spyOn(notificationGateway, "notify");
  createUser = new CreateUser(userRepository);
  createWallet = new CreateWallet(walletRepository, userRepository);
  getWallet = new GetWallet(walletRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  getTransaction = new GetTransaction(transactionRepository);
  sut = new TransferAmount(
    walletRepository,
    userRepository,
    transactionRepository,
    transactionGateway,
    notificationGateway
  );
});

test("Deve ser possivel realizar uma transferencia entre dois clientes", async () => {
  const inputCreateUser1 = {
    name: "John Doe",
    document: "97456321558",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const inputCreateUser2 = {
    name: "John Doe",
    document: "71428793860",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser1 = await createUser.execute(inputCreateUser1);
  const outputCreateUser2 = await createUser.execute(inputCreateUser2);
  const outputCreateWallet1 = await createWallet.execute({
    userId: outputCreateUser1.userId,
  });
  const outputCreateWallet2 = await createWallet.execute({
    userId: outputCreateUser2.userId,
  });
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  const outputTransferAmount = await sut.execute(inputTransferAmount);
  expect(outputTransferAmount.transactionId).toBeDefined();
  expect(notifySpy).toHaveBeenCalledTimes(1);
  const outputGetWallet1 = await getWallet.execute({
    walletId: outputCreateWallet1.walletId,
  });
  expect(outputGetWallet1.balance).toBe(50);
  const outputGetWallet2 = await getWallet.execute({
    walletId: outputCreateWallet2.walletId,
  });
  expect(outputGetWallet2.balance).toBe(50);
  const inputGetTransaction = {
    transactionId: outputTransferAmount.transactionId,
  };
  const outputGetTransaction = await getTransaction.execute(
    inputGetTransaction
  );
  expect(outputGetTransaction.transactionId).toBe(
    outputTransferAmount.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputTransferAmount.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputTransferAmount.payeeId);
  expect(outputGetTransaction.amount).toBe(inputTransferAmount.amount);
  expect(outputGetTransaction.status).toBe("transfer");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel realizar uma transferencia entre um pagador do tipo cliente e um recebedor do tipo lojista", async () => {
  const inputCreateUser1 = {
    name: "John Doe",
    document: "97456321558",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const inputCreateUser2 = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser1 = await createUser.execute(inputCreateUser1);
  const outputCreateUser2 = await createUser.execute(inputCreateUser2);
  const outputCreateWallet1 = await createWallet.execute({
    userId: outputCreateUser1.userId,
  });
  const outputCreateWallet2 = await createWallet.execute({
    userId: outputCreateUser2.userId,
  });
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 90,
  };
  const outputTransferAmount = await sut.execute(inputTransferAmount);
  expect(outputTransferAmount.transactionId).toBeDefined();
  expect(notifySpy).toHaveBeenCalledTimes(1);
  const outputGetWallet1 = await getWallet.execute({
    walletId: outputCreateWallet1.walletId,
  });
  expect(outputGetWallet1.balance).toBe(10);
  const outputGetWallet2 = await getWallet.execute({
    walletId: outputCreateWallet2.walletId,
  });
  expect(outputGetWallet2.balance).toBe(90);
});

test("Não deve ser possivel realizar uma transferencia se o pagador for do tipo lojista", async () => {
  const inputCreateUser1 = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const inputCreateUser2 = {
    name: "John Doe",
    document: "71428793860",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser1 = await createUser.execute(inputCreateUser1);
  const outputCreateUser2 = await createUser.execute(inputCreateUser2);
  const outputCreateWallet1 = await createWallet.execute({
    userId: outputCreateUser1.userId,
  });
  const outputCreateWallet2 = await createWallet.execute({
    userId: outputCreateUser2.userId,
  });
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Sellers cannot make transfers")
  );
  expect(notifySpy).not.toHaveBeenCalled();
});

test("Não deve ser possivel realizar uma transferencia se ela não foi autorizada", async () => {
  (transactionGateway.authorize as jest.Mock).mockRejectedValue(
    new Error("Unauthorized transaction")
  );
  const inputCreateUser1 = {
    name: "John Doe",
    document: "97456321558",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const inputCreateUser2 = {
    name: "John Doe",
    document: "71428793860",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser1 = await createUser.execute(inputCreateUser1);
  const outputCreateUser2 = await createUser.execute(inputCreateUser2);
  const outputCreateWallet1 = await createWallet.execute({
    userId: outputCreateUser1.userId,
  });
  const outputCreateWallet2 = await createWallet.execute({
    userId: outputCreateUser2.userId,
  });
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Unauthorized transaction")
  );
  expect(notifySpy).not.toHaveBeenCalled();
});
