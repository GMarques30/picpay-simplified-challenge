import { Transaction } from "../../domain/entity/Transaction";
import { MakeTransfer } from "../../domain/service/MakeTransfer";
import { AccountGateway } from "../gateway/AccountGateway";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class TransferAmount {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly transactionRepository: TransactionRepository,
    readonly transactionGateway: TransactionGateway,
    readonly notificationGateway: NotificationGateway,
    readonly accountGateway: AccountGateway
  ) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<Output> {
    const payerWallet = await this.walletRepository.getByWalletId(payerId);
    const payeeWallet = await this.walletRepository.getByWalletId(payeeId);
    if (!payerWallet || !payeeWallet) throw new Error("Wallet not found");
    const payerAccount = await this.accountGateway.getByAccountId(
      payerWallet.accountId
    );
    const CPF_LENGTH = 11;
    if (payerAccount.document.length !== CPF_LENGTH)
      throw new Error("Sellers cannot make transfers");
    MakeTransfer.transfer(payerWallet, payeeWallet, amount);
    const transaction = Transaction.create(
      payerWallet.walletId,
      payeeWallet.walletId,
      amount,
      "transfer"
    );
    await this.transactionGateway.authorize();
    await this.walletRepository.update(payerWallet);
    await this.walletRepository.update(payeeWallet);
    await this.transactionRepository.save(transaction);
    const payeeAccount = await this.accountGateway.getByAccountId(
      payeeWallet.accountId
    );
    await this.notificationGateway.notify(payeeAccount.email);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
};

type Output = {
  transactionId: string;
};
