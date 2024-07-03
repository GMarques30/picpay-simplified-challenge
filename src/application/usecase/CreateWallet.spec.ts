import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateUser } from "./CreateUser";
import { CreateWallet } from "./CreateWallet";
import { GetWallet } from "./GetWallet";

let userRepository: UserRepository;
let walletRepository: WalletRepository;
let createUser: CreateUser;
let getWallet: GetWallet;
let sut: CreateWallet;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  walletRepository = new WalletRepositoryMemory();
  createUser = new CreateUser(userRepository);
  getWallet = new GetWallet(walletRepository);
  sut = new CreateWallet(walletRepository, userRepository);
});

test("Deve ser possivel criar uma carteira", async () => {
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
  const outputCreateWallet = await sut.execute(inputCreateWallet);
  expect(outputCreateWallet.walletId).toBeDefined();
  const inputGetWallet = {
    walletId: outputCreateWallet.walletId,
  };
  const outputGetWallet = await getWallet.execute(inputGetWallet);
  expect(outputGetWallet.walletId).toBe(outputCreateWallet.walletId);
  expect(outputGetWallet.userId).toBe(outputCreateUser.userId);
  expect(outputGetWallet.balance).toBe(0);
});

test("Não deve ser possivel criar uma carteira sem um usario existente", async () => {
  const inputCreateWallet = {
    userId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(inputCreateWallet)).rejects.toThrow(
    new Error("User not found")
  );
});
