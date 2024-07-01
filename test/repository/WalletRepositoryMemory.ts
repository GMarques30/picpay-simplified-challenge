import { WalletRepository } from "../../src/application/repository/WalletRepository";
import { Wallet } from "../../src/domain/entity/Wallet";

export class WalletRepositoryMemory implements WalletRepository {
  wallets: Wallet[];

  constructor() {
    this.wallets = [];
  }

  async saveWallet(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
  }

  async getWalletByWalletId(walletId: string): Promise<Wallet | undefined> {
    return this.wallets.find((wallet) => wallet.walletId === walletId);
  }
}
