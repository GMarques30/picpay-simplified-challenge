import { Wallet } from "../../domain/entity/Wallet";

export interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  getByWalletId(walletId: string): Promise<Wallet>;
  update(wallet: Wallet): Promise<void>;
}
