import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { CreateWallet } from "./CreateWallet";
import { GetWallet } from "./GetWallet";
import { DepositAmount } from "./DepositAmount";
import { WalletRepository } from "../repository/WalletRepository";
import { TransactionRepository } from "../repository/TransactionRepository";

let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let sut: DepositAmount;

beforeEach(() => {
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createWallet = new CreateWallet(walletRepository);
  getWallet = new GetWallet(walletRepository);
  sut = new DepositAmount(walletRepository, transactionRepository);
});

test("Deve ser possivel depositar um valor na carteira de um cliente", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputGetWallet = {
    accountId: inputCreateWallet.accountId,
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
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
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
