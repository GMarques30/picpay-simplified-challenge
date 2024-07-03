import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { CreateUser } from "./CreateUser";
import { CreateWallet } from "./CreateWallet";

test("Deve ser possivel criar uma carteira", async () => {
  const userRepository = new UserRepositoryMemory();
  const walletRepository = new WalletRepositoryMemory();
  const createUser = new CreateUser(userRepository);
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
  const sut = new CreateWallet(walletRepository, userRepository);
  const inputCreateWallet = {
    userId: outputCreateUser.userId,
  };
  const outputCreateWallet = await sut.execute(inputCreateWallet);
  expect(outputCreateWallet.walletId).toBeDefined();
});

test("Não deve ser possivel criar uma carteira sem um usario existente", async () => {
  const userRepository = new UserRepositoryMemory();
  const walletRepository = new WalletRepositoryMemory();
  const sut = new CreateWallet(walletRepository, userRepository);
  const inputCreateWallet = {
    userId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(inputCreateWallet)).rejects.toThrow(
    new Error("User not found")
  );
});
