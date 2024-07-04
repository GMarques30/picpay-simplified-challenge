export class CNPJ {
  private _value: string;
  private readonly CNPJ_LENGTH = 14;
  private readonly FACTOR_FIRST_DIGIT_CNPJ = 5;
  private readonly FACTOR_SECOND_DIGIT_CNPJ = 6;

  constructor(cnpj: string) {
    if (!this.validate(cnpj)) throw new Error("Invalid CNPJ");
    this._value = cnpj;
  }

  getValue() {
    return this._value;
  }

  private validate(rawCnpj: string) {
    if (!rawCnpj) return false;
    const cnpj = this.removeNonDigits(rawCnpj);
    if (cnpj.length !== this.CNPJ_LENGTH) return false;
    if (this.allDigitsTheSame(cnpj)) return false;

    const digits = cnpj.substring(0, 12);
    const calculatedDigit1 = this.calculateDigitCnpj(
      digits,
      this.FACTOR_FIRST_DIGIT_CNPJ
    );
    const calculatedDigit2 = this.calculateDigitCnpj(
      digits + calculatedDigit1,
      this.FACTOR_SECOND_DIGIT_CNPJ
    );

    return (
      cnpj ===
      digits + calculatedDigit1.toString() + calculatedDigit2.toString()
    );
  }

  private removeNonDigits(cnpj: string) {
    return cnpj.replace(/[^\d]/g, "");
  }

  private allDigitsTheSame(cnpj: string) {
    const firstDigit = cnpj[0];
    return cnpj.split("").every((digit) => digit === firstDigit);
  }

  private calculateDigitCnpj(digits: string, factor: number) {
    let total = 0;
    for (const digit of digits) {
      total += parseInt(digit) * factor--;
      if (factor < 2) factor = 9;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
}
