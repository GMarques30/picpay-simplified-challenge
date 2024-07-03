import { Transaction } from "../../domain/entity/Transaction";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class WithdrawAmount {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly transactionRepository: TransactionRepository
  ) {}

  async execute({ walletId, amount }: Input): Promise<Output> {
    const wallet = await this.walletRepository.getByWalletId(walletId);
    wallet.withdraw(amount);
    const transaction = Transaction.create(
      wallet.userId,
      wallet.userId,
      amount,
      "withdraw"
    );
    await this.transactionRepository.save(transaction);
    await this.walletRepository.update(wallet);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type Input = {
  walletId: string;
  amount: number;
};

type Output = {
  transactionId: string;
};
