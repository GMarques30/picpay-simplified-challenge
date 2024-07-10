import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateWallet } from "./CreateWallet";
import { DepositAmount } from "./DepositAmount";
import { GetTransaction } from "./GetTransaction";
import { WithdrawAmount } from "./WithdrawAmount";

let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let createWallet: CreateWallet;
let depositAmount: DepositAmount;
let withdrawAmount: WithdrawAmount;
let sut: GetTransaction;

beforeEach(async () => {
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  createWallet = new CreateWallet(walletRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  withdrawAmount = new WithdrawAmount(walletRepository, transactionRepository);
  sut = new GetTransaction(transactionRepository);
});

test("Deve ser possivel obter uma transaction do tipo deposit", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  const outputDepositAmount = await depositAmount.execute(inputDepositAmount);
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
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await createWallet.execute(inputCreateWallet);
  const inputDepositAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 100,
  };
  const outputDepositAmount = await depositAmount.execute(inputDepositAmount);
  const inputWithdrawAmount = {
    walletId: outputCreateWallet.walletId,
    amount: 50,
  };
  const outputWithdrawAmount = await withdrawAmount.execute(
    inputWithdrawAmount
  );
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
