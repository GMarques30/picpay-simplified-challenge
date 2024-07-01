import { WalletRepository } from "../repository/WalletRepository";

export class GetWallet {
  constructor(readonly walletRepository: WalletRepository) {}

  async execute({ walletId }: GetWalletInput): Promise<GetWalletOutput> {
    const wallet = await this.walletRepository.getWalletByWalletId(walletId);
    if (!wallet) throw new Error("Wallet does not exists");
    return {
      walletId: wallet.walletId,
      userId: wallet.userId,
      balance: wallet.getBalance(),
    };
  }
}

type GetWalletInput = {
  walletId: string;
};

type GetWalletOutput = {
  walletId: string;
  userId: string;
  balance: number;
};
