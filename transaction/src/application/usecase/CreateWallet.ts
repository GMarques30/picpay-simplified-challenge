import { Wallet } from "../../domain/entity/Wallet";
import { WalletRepository } from "../repository/WalletRepository";

export class CreateWallet {
  constructor(readonly walletRepository: WalletRepository) {}

  async execute({ accountId }: Input): Promise<Output> {
    const walletExists = await this.walletRepository.getByAccountId(accountId);
    if (walletExists) throw new Error("Wallet already exists");
    const wallet = Wallet.create(accountId);
    await this.walletRepository.save(wallet);
    return {
      walletId: wallet.walletId,
    };
  }
}

type Input = {
  accountId: string;
};

type Output = {
  walletId: string;
};
