import crypto from "node:crypto";

export class Password {
  private constructor(private _value: string) {}

  getValue() {
    return this._value;
  }

  passwordMatches(password: string) {
    return (
      this._value ===
      crypto.createHash("SHA-256").update(password).digest("hex")
    );
  }

  static create(password: string) {
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
      )
    )
      throw new Error("Invalid password");
    const encryptedPassword = crypto
      .createHash("SHA-256")
      .update(password)
      .digest("hex");
    return new Password(encryptedPassword);
  }

  static restore(password: string) {
    return new Password(password);
  }
}
