import { WalletRepository } from "../repository/WalletRepository";

export class GetWallet {
  constructor(readonly walletRepository: WalletRepository) {}

  async execute({ walletId }: Input): Promise<Output> {
    const wallet = await this.walletRepository.getByWalletId(walletId);
    return {
      walletId: wallet.walletId,
      userId: wallet.userId,
      balance: wallet.getBalance(),
    };
  }
}

type Input = {
  walletId: string;
};

type Output = {
  walletId: string;
  userId: string;
  balance: number;
};
