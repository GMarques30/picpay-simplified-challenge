export abstract class TransactionType {
  abstract value: string;
}

export class DepositType extends TransactionType {
  value: string;

  constructor() {
    super();
    this.value = "deposit";
  }
}

export class WithdrawType extends TransactionType {
  value: string;

  constructor() {
    super();
    this.value = "withdraw";
  }
}

export class TransferType extends TransactionType {
  value: string;

  constructor() {
    super();
    this.value = "transfer";
  }
}

export class TransactionTypeFactory {
  static create(status: string) {
    if (status === "deposit") return new DepositType();
    if (status === "withdraw") return new WithdrawType();
    if (status === "transfer") return new TransferType();
    throw new Error("Invalid type");
  }
}
