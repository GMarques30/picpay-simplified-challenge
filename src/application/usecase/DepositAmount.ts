import { Transaction } from "../../domain/entity/Transaction";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "./../repository/WalletRepository";

export class DepositAmount {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly transactionRepository: TransactionRepository
  ) {}

  async execute({
    walletId,
    amount,
  }: DepositAmountInput): Promise<DepositAmountOutput> {
    const wallet = await this.walletRepository.getWalletByWalletId(walletId);
    if (!wallet) throw new Error("Wallet does not exists");
    wallet.deposit(amount);
    const transaction = Transaction.create(
      wallet.userId,
      wallet.userId,
      amount
    );
    await this.transactionRepository.saveTransaction(transaction);
    await this.walletRepository.updateWallet(wallet);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type DepositAmountInput = {
  walletId: string;
  amount: number;
};

type DepositAmountOutput = {
  transactionId: string;
};
