export class Name {
  private _value: string;

  constructor(name: string) {
    if (!name.match(/[a-zA-z] [a-zA-Z]+/)) throw new Error("Invalid name");
    this._value = name;
  }

  getValue() {
    return this._value;
  }
}
