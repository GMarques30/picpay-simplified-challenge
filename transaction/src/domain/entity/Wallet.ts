export class Wallet {
  readonly walletId: string;
  readonly accountId: string;
  private _balance: number;

  private constructor(walletId: string, accountId: string, balance: number) {
    this.walletId = walletId;
    this.accountId = accountId;
    this._balance = balance;
  }

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this._balance += amount;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("Invalid withdraw");
    if (this._balance < amount) throw new Error("Insufficient balance");
    this._balance -= amount;
  }

  getBalance() {
    return this._balance;
  }

  static create(accountId: string) {
    const walletId = crypto.randomUUID();
    const balance = 0;
    return new Wallet(walletId, accountId, balance);
  }

  static restore(walletId: string, accountId: string, balance: number) {
    return new Wallet(walletId, accountId, balance);
  }
}
