import { Wallet } from "../../domain/entity/Wallet";

export interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
  getByWalletId(walletId: string): Promise<Wallet | undefined>;
  getByAccountId(accountId: string): Promise<Wallet | undefined>;
  update(wallet: Wallet): Promise<void>;
}
