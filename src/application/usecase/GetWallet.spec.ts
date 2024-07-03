import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { CreateUser } from "./CreateUser";
import { CreateWallet } from "./CreateWallet";
import { GetWallet } from "./GetWallet";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

let userRepository: UserRepository;
let walletRepository: WalletRepository;
let createUser: CreateUser;
let createWallet: CreateWallet;
let sut: GetWallet;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  createUser = new CreateUser(userRepository);
  createWallet = new CreateWallet(walletRepository, userRepository);
  sut = new GetWallet(walletRepository);
});

test("Deve ser possivel obter os dados de uma carteira", async () => {
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
  expect(outputCreateWallet.walletId).toBeDefined();
  const inputGetWallet = {
    walletId: outputCreateWallet.walletId,
  };
  const outputGetWallet = await sut.execute(inputGetWallet);
  expect(outputGetWallet.walletId).toBe(outputCreateWallet.walletId);
  expect(outputGetWallet.userId).toBe(outputCreateUser.userId);
  expect(outputGetWallet.balance).toBe(0);
});

test("Não deve ser possivel obter os dados de uma carteira inexistente", () => {
  const input = {
    walletId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Wallet not found")
  );
});
