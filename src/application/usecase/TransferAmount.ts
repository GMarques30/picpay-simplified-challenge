import { Transaction } from "../../domain/entity/Transaction";
import { MakeTransfer } from "../../domain/service/MakeTransfer";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionRepository } from "../repository/TransactionRepository";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class TransferAmount {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly userRepository: UserRepository,
    readonly transactionRepository: TransactionRepository,
    readonly transactionGateway: TransactionGateway,
    readonly notificationGateway: NotificationGateway
  ) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<Output> {
    const payerWallet = await this.walletRepository.getByWalletId(payerId);
    const payeeWallet = await this.walletRepository.getByWalletId(payeeId);
    const accountIsTypeCustomer =
      await this.userRepository.checkIfUserIsCustomer(payerWallet.userId);
    if (!accountIsTypeCustomer)
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
    const payeeAccount = await this.userRepository.getByUserId(
      payeeWallet.userId
    );
    await this.notificationGateway.notify(payeeAccount.getEmail());
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
