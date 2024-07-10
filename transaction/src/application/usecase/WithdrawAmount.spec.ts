import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateWallet } from "./CreateWallet";
import { DepositAmount } from "./DepositAmount";
import { GetWallet } from "./GetWallet";
import { WithdrawAmount } from "./WithdrawAmount";

let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let depositAmount: DepositAmount;
let sut: WithdrawAmount;

beforeEach(() => {
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createWallet = new CreateWallet(walletRepository);
  getWallet = new GetWallet(walletRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  sut = new WithdrawAmount(walletRepository, transactionRepository);
});

test("Deve ser possivel retirar um montante na carteira de um cliente", async () => {
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
  await depositAmount.execute(inputDepositAmount);
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
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputWithdrawAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 200,
  };
  expect(async () => await sut.execute(inputWithdrawAmount)).rejects.toThrow(
    new Error("Insufficient balance")
  );
});

test("Não deve ser possivel retirar com um montante invalido", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
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
    new Error("Wallet not found")
  );
});
