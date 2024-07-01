import crypto from "node:crypto";
import { Email } from "../value-object/Email";
import { CPF } from "../value-object/CPF";
import { CNPJ } from "../value-object/CNPJ";
import { Name } from "../value-object/Name";

export abstract class User {
  readonly userId: string;
  protected _name: Name;
  protected _email: Email;
  protected _password: string;

  protected constructor(
    userId: string,
    name: string,
    email: string,
    password: string
  ) {
    this.userId = userId;
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

export class CustomerUser extends User {
  private _document: CPF;

  private constructor(
    userId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    super(userId, name, email, password);
    this._document = new CPF(document);
  }

  static create(
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    const userId = crypto.randomUUID();
    return new CustomerUser(userId, name, document, email, password);
  }

  static restore(
    userId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    return new CustomerUser(userId, name, document, email, password);
  }

  getDocument() {
    return this._document.getValue();
  }
}

export class SellerUser extends User {
  private _document: CNPJ;

  private constructor(
    userId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    super(userId, name, email, password);
    this._document = new CNPJ(document);
  }

  static create(
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    const userId = crypto.randomUUID();
    return new SellerUser(userId, name, document, email, password);
  }

  static restore(
    userId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ) {
    return new SellerUser(userId, name, document, email, password);
  }

  getDocument() {
    return this._document.getValue();
  }
}

export class UserFactory {
  static createUser(
    name: string,
    document: string,
    email: string,
    password: string
  ): User {
    if (document.length === 11)
      return CustomerUser.create(name, document, email, password);
    if (document.length === 14)
      return SellerUser.create(name, document, email, password);
    throw new Error("Invalid document length");
  }

  static restoreUser(
    userId: string,
    name: string,
    document: string,
    email: string,
    password: string
  ): User {
    if (document.length === 11)
      return CustomerUser.restore(userId, name, document, email, password);
    if (document.length === 14)
      return SellerUser.restore(userId, name, document, email, password);
    throw new Error("Invalid document length");
  }
}
