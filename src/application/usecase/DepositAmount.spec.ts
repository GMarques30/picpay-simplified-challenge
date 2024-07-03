import { UserRepository } from "./../repository/UserRepository";
import { CreateWallet } from "./CreateWallet";
import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { CreateUser } from "./CreateUser";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { DepositAmount } from "./DepositAmount";
import { GetWallet } from "./GetWallet";
import { WalletRepository } from "../repository/WalletRepository";
import { TransactionRepository } from "../repository/TransactionRepository";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";

let userRepository: UserRepository;
let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createUser: CreateUser;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let sut: DepositAmount;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createUser = new CreateUser(userRepository);
  createWallet = new CreateWallet(walletRepository, userRepository);
  getWallet = new GetWallet(walletRepository);
  sut = new DepositAmount(walletRepository, transactionRepository);
});

test("Deve ser possivel depositar um valor na carteira de um cliente", async () => {
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
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
  const outputDepositAmount = await sut.execute(inputDepositAmount);
  expect(outputDepositAmount.transactionId).toBeDefined();
  const outputGetWalletBefore = await getWallet.execute(inputGetWallet);
  expect(outputGetWalletBefore.balance).toBe(100);
});

test("Não deve ser possivel realizar um deposito com um montante invalido", async () => {
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
  const inputCreateWallet = {
    userId: outputCreateUser.userId,
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: -100,
  };
  expect(async () => await sut.execute(inputDepositAmount)).rejects.toThrow(
    new Error("Invalid deposit")
  );
});

test("Não deve ser possivel fazer um deposito em uma carteira inexistente", () => {
  const input = {
    walletId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Wallet not found")
  );
});
