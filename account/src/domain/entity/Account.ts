import { Document, DocumentFactory } from "../value-object/Document";
import { Email } from "../value-object/Email";
import { Name } from "../value-object/Name";
import { Password } from "../value-object/Password";

export class Account {
  private constructor(
    readonly accountId: string,
    private _name: Name,
    private _email: Email,
    private _password: Password,
    private _document: Document,
    private _balance: number
  ) {}

  deposit(amount: number) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this._balance += amount;
  }

  withdraw(amount: number) {
    if (amount <= 0) throw new Error("Invalid withdraw");
    if (this._balance < amount) throw new Error("Insufficient balance");
    this._balance -= amount;
  }

  getName() {
    return this._name.getValue();
  }

  setName(name: string) {
    this._name = new Name(name);
  }

  getEmail() {
    return this._email.getValue();
  }

  setEmail(email: string) {
    this._email = new Email(email);
  }

  getPassword() {
    return this._password.getValue();
  }

  setPassword(password: string) {
    this._password = Password.create(password);
  }

  getDocument() {
    return this._document.getValue();
  }

  setDocument(document: string) {
    this._document = DocumentFactory.create(document);
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
