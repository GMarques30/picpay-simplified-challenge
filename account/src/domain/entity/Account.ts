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
    private _document: Document
  ) {}

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

  static create(
    name: string,
    email: string,
    password: string,
    document: string
  ) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      Password.create(password),
      DocumentFactory.create(document)
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    password: string,
    document: string
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      Password.restore(password),
      DocumentFactory.create(document)
    );
  }
}
