export class Email {
  private _value;

  constructor(email: string) {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
      throw new Error("Invalid email");
    this._value = email;
  }

  getValue() {
    return this._value;
  }
}
