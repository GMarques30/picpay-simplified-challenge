import crypto from "node:crypto";
import { Email } from "../value-object/Email";
import { CPF } from "../value-object/CPF";
import { CNPJ } from "../value-object/CNPJ";
import { Name } from "../value-object/Name";

export abstract class Account {
  readonly accountId: string;
  protected _name: Name;
  protected _email: Email;
  protected _password: string;

  protected constructor(
    accountId: string,
    name: string,
    email: string,
    password: string
  ) {
    this.accountId = accountId;
    this._name = new Name(name);
    this._email = new Email(email);
    this._password = password;
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
    return this._password;
  }

  abstract getDocument(): string;
}

export class CustomerAccount extends Account {
  private _document: CPF;

  private constructor(
    accountId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    super(accountId, name, email, password);
    this._document = new CPF(document);
  }

  static create(
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    const accountId = crypto.randomUUID();
    return new CustomerAccount(accountId, name, document, email, password);
  }

  static restore(
    accountId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    return new CustomerAccount(accountId, name, document, email, password);
  }

  getDocument() {
    return this._document.getValue();
  }
}

export class SellerAccount extends Account {
  private _document: CNPJ;

  private constructor(
    accountId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    super(accountId, name, email, password);
    this._document = new CNPJ(document);
  }

  static create(
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    const accountId = crypto.randomUUID();
    return new SellerAccount(accountId, name, document, email, password);
  }

  static restore(
    accountId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    return new SellerAccount(accountId, name, document, email, password);
  }

  getDocument() {
    return this._document.getValue();
  }
}

export class AccountFactory {
  static createAccount(
    name: string,
    document: string,
    email: string,
    password: string
  ): Account {
    if (document.length === 11)
      return CustomerAccount.create(name, document, email, password);
    if (document.length === 14)
      return SellerAccount.create(name, document, email, password);
    throw new Error("Invalid document length");
  }

  static restoreAccount(
    accountId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ): Account {
    if (document.length === 11)
      return CustomerAccount.restore(
        accountId,
        name,
        document,
        email,
        password
      );
    if (document.length === 14)
      return SellerAccount.restore(accountId, name, document, email, password);
    throw new Error("Invalid document length");
  }
}
