import { WalletRepository } from "../../src/application/repository/WalletRepository";
import { Wallet } from "../../src/domain/entity/Wallet";

export class WalletRepositoryMemory implements WalletRepository {
  wallets: Wallet[];

  constructor() {
    this.wallets = [];
  }

  async save(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
  }

  async getByWalletId(walletId: string): Promise<Wallet> {
    const wallet = this.wallets.find((wallet) => wallet.walletId === walletId);
    if (!wallet) throw new Error("Wallet not found");
    return wallet;
  }

  async update(wallet: Wallet): Promise<void> {
    const index = this.wallets.findIndex((w) => w.walletId === wallet.walletId);
    this.wallets[index] = wallet;
  }
}
