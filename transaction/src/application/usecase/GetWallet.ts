import { WalletRepository } from "../repository/WalletRepository";

export class GetWallet {
  constructor(readonly walletRepository: WalletRepository) {}

  async execute({ accountId }: Input): Promise<Output> {
    const wallet = await this.walletRepository.getByAccountId(accountId);
    if (!wallet) throw new Error("Wallet not found");
    return {
      walletId: wallet.walletId,
      accountId: wallet.accountId,
      balance: wallet.getBalance(),
    };
  }
}

type Input = {
  accountId: string;
};

type Output = {
  walletId: string;
  accountId: string;
  balance: number;
};
