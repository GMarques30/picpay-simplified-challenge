export class Wallet {
  readonly walletId: string;
  readonly userId: string;
  private _balance: number;

  private constructor(walletId: string, userId: string, balance: number) {
    this.walletId = walletId;
    this.userId = userId;
    this._balance = balance;
  }

  static create(userId: string) {
    const walletId = crypto.randomUUID();
    const balance = 0;
    return new Wallet(walletId, userId, balance);
  }

  static restore(walletId: string, userId: string, balance: number) {
    return new Wallet(walletId, userId, balance);
  }

  getBalance() {
    return this._balance;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("Invalid withdraw");
    if (this._balance < amount) throw new Error("Insufficient balance");
    this._balance -= amount;
  }

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this._balance += amount;
  }
}
