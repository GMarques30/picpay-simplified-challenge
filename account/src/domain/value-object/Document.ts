export interface Document {
  value: string;
  getValue(): string;
}

class CPF implements Document {
  value: string;
  private readonly CPF_LENGTH = 11;
  private readonly FACTOR_FIRST_DIGIT = 10;
  private readonly FACTOR_SECOND_DIGIT = 11;

  constructor(cpf: string) {
    if (!this.validate(cpf)) throw new Error("Invalid CPF");
    this.value = cpf;
  }

  getValue() {
    return this.value;
  }

  private validate(rawCpf: string) {
    if (!rawCpf) return false;
    const cpf = this.removeNonDigits(rawCpf);
    if (cpf.length !== this.CPF_LENGTH) return false;
    if (this.allDigitsTheSame(cpf)) return false;
    const digit1 = this.calculateDigit(cpf, this.FACTOR_FIRST_DIGIT);
    const digit2 = this.calculateDigit(cpf, this.FACTOR_SECOND_DIGIT);
    return this.extractActualDigit(cpf) === `${digit1}${digit2}`;
  }

  private removeNonDigits(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  private allDigitsTheSame(cpf: string) {
    const [firstDigit] = cpf;
    return [...cpf].every((digit) => digit === firstDigit);
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private extractActualDigit(cpf: string) {
    return cpf.slice(9);
  }
}

class CNPJ implements Document {
  value: string;
  private readonly CNPJ_LENGTH = 14;
  private readonly FACTOR_FIRST_DIGIT_CNPJ = 5;
  private readonly FACTOR_SECOND_DIGIT_CNPJ = 6;

  constructor(cnpj: string) {
    if (!this.validate(cnpj)) throw new Error("Invalid CNPJ");
    this.value = cnpj;
  }

  getValue() {
    return this.value;
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

export class DocumentFactory {
  static create(document: string) {
    if (!document) throw new Error("Invalid document");
    if (document.length === 11) return new CPF(document);
    if (document.length === 14) return new CNPJ(document);
    throw new Error("Invalid document");
  }
}
