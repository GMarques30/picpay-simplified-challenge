import { Observable } from "../observer/Observable";
import { Document, DocumentFactory } from "../value-object/Document";
import { Email } from "../value-object/Email";
import { Name } from "../value-object/Name";
import { Password } from "../value-object/Password";
import { DepositPlaced } from "../event/DepositPlaced";
import { WithdrawPlaced } from "../event/WithdrawPlaced";

export class Account extends Observable {
  private constructor(
    readonly accountId: string,
    private _name: Name,
    private _email: Email,
    private _password: Password,
    private _document: Document,
    private _balance: number
  ) {
    super();
  }

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this._balance += amount;
    this.notify(
      new DepositPlaced({
        to: this.getEmail(),
        payerId: this.accountId,
        payeeId: this.accountId,
        amount,
        type: "deposit",
      })
    );
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("Invalid withdraw");
    if (this._balance < amount) throw new Error("Insufficient balance");
    this._balance -= amount;
    this.notify(
      new WithdrawPlaced({
        to: this.getEmail(),
        payerId: this.accountId,
        payeeId: this.accountId,
        amount,
        type: "withdraw",
      })
    );
  }

  getName() {
    return this._name.getValue();
  }

  getEmail() {
    return this._email.getValue();
  }

  getPassword() {
    return this._password.getValue();
  }

  getDocument() {
    return this._document.getValue();
  }

  getBalance() {
    return this._balance;
  }

  static create(
    name: string,
    email: string,
    password: string,
    document: string
  ) {
    const accountId = crypto.randomUUID();
    const balance = 0;
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      Password.create(password),
      DocumentFactory.create(document),
      balance
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    password: string,
    document: string,
    balance: number
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      Password.restore(password),
      DocumentFactory.create(document),
      balance
    );
  }
}
