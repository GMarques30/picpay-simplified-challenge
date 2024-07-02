import { UserRepository } from "../repository/UserRepository";
import { CreateWallet } from "./CreateWallet";
import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { CreateUser } from "./CreateUser";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { DepositAmount } from "./DepositAmount";
import { GetWallet } from "./GetWallet";
import { WalletRepository } from "../repository/WalletRepository";
import { TransactionRepository } from "../repository/TransactionRepository";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { WithdrawAmount } from "./WithdrawAmount";

let userRepository: UserRepository;
let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createUser: CreateUser;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let depositAmount: DepositAmount;
let sut: WithdrawAmount;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createUser = new CreateUser(userRepository);
  createWallet = new CreateWallet(walletRepository, userRepository);
  getWallet = new GetWallet(walletRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  sut = new WithdrawAmount(walletRepository, transactionRepository);
});

test("Deve ser possivel retirar um montante na carteira de um cliente", async () => {
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
  const inputGetWallet = {
    walletId: outputCreateWallet.walletId,
  };
  const outputGetWalletAfter = await getWallet.execute(inputGetWallet);
  expect(outputGetWalletAfter.balance).toBe(0);
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
  const outputWithdrawAmount = await sut.execute(inputWithdrawAmount);
  expect(outputWithdrawAmount.transactionId).toBeDefined();
  const outputGetWalletBefore = await getWallet.execute(inputGetWallet);
  expect(outputGetWalletBefore.balance).toBe(50);
});

test("Não deve ser possivel retirar um montante com saldo insuficiente", async () => {
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
    amount: 200,
  };
  expect(async () => await sut.execute(inputWithdrawAmount)).rejects.toThrow(
    new Error("Insufficient balance")
  );
});

test("Não deve ser possivel retirar com um montante invalido", async () => {
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
    amount: -100,
  };
  expect(async () => await sut.execute(inputWithdrawAmount)).rejects.toThrow(
    new Error("Invalid withdraw")
  );
});

test("Não deve ser possivel fazer uma retirada em uma carteira inexistente", () => {
  const input = {
    walletId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Wallet does not exists")
  );
});
