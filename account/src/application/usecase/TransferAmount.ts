import { AccountRepository } from "./../repository/AccountRepository";
import { MakeTransfer } from "../../domain/service/MakeTransfer";

export class TransferAmount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<void> {
    const payerAccount = await this.accountRepository.getByAccountId(payerId);
    const payeeAccount = await this.accountRepository.getByAccountId(payeeId);
    if (!payerAccount || !payeeAccount) throw new Error("Account not found");
    const CPF_LENGTH = 11;
    if (payerAccount?.getDocument().length !== CPF_LENGTH)
      throw new Error("Sellers cannot make transfers");
    MakeTransfer.transfer(payerAccount, payeeAccount, amount);
    // const transaction = Transaction.create(
    //   payerWallet.walletId,
    //   payeeWallet.walletId,
    //   amount,
    //   "transfer"
    // );

    // await this.transactionGateway.authorize(); ---> Você será feito em outro bounded context

    //Envio um evento de dominio chamado transfer completed, que acontecerá dentro do Make Transfer
    await this.accountRepository.update(payerAccount);
    await this.accountRepository.update(payeeAccount);
    // await this.notificationGateway.notify(payeeAccount.getEmail()); ---> Você será feito em outro bounded context
    // return {
    //   transactionId: transaction.transactionId,
    // };
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
};

// type Output = {
//   transactionId: string;
// };
