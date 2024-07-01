import { Wallet } from "../../domain/entity/Wallet";

export interface WalletRepository {
  saveWallet(wallet: Wallet): Promise<void>;
  getWalletByWalletId(walletId: string): Promise<Wallet | undefined>;
}
