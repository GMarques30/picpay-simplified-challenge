export interface TransactionGateway {
  createWallet(accountId: string): Promise<void>;
}
