import { Transaction } from "../../domain/entity/Transaction";
import { MakeTransfer } from "../../domain/service/MakeTransfer";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionRepository } from "../repository/TransactionRepository";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class TransferAmount {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly userRepository: UserRepository,
    readonly transactionRepository: TransactionRepository,
    readonly transactionGateway: TransactionGateway
  ) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<Output> {
    const payer = await this.walletRepository.getByWalletId(payerId);
    const payee = await this.walletRepository.getByWalletId(payeeId);
    const accountIsTypeCustomer =
      await this.userRepository.checkIfUserIsCustomer(payer.userId);
    if (!accountIsTypeCustomer)
      throw new Error("Sellers cannot make transfers");
    MakeTransfer.transfer(payer, payee, amount);
    const transaction = Transaction.create(
      payer.walletId,
      payee.walletId,
      amount,
      "transfer"
    );
    const isAuthorized = await this.transactionGateway.authorizeTransaction();
    if (!isAuthorized.data.authorization)
      throw new Error("Unauthorized transaction");
    await this.walletRepository.update(payer);
    await this.walletRepository.update(payee);
    await this.transactionRepository.save(transaction);
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
