import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateWallet } from "./CreateWallet";
import { GetWallet } from "./GetWallet";

let walletRepository: WalletRepository;
let createWallet: CreateWallet;
let sut: GetWallet;

beforeEach(() => {
  walletRepository = new WalletRepositoryMemory(); // Não compartilha da mesma intancia do Server (Singleton)
  createWallet = new CreateWallet(walletRepository);
  sut = new GetWallet(walletRepository);
});

test("Deve ser possivel obter os dados de uma carteira", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputGetWallet = {
    accountId: inputCreateWallet.accountId,
  };
  const outputGetWallet = await sut.execute(inputGetWallet);
  expect(outputGetWallet.walletId).toBe(outputCreateWallet.walletId);
  expect(outputGetWallet.accountId).toBe(inputCreateWallet.accountId);
  expect(outputGetWallet.balance).toBe(0);
});

test("Não deve ser possivel obter os dados de uma carteira inexistente", () => {
  const input = {
    accountId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Wallet not found")
  );
});
