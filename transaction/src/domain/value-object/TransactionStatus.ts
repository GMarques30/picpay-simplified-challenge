export abstract class TransactionStatus {
  abstract value: string;
}

export class DepositStatus extends TransactionStatus {
  value: string;

  constructor() {
    super();
    this.value = "deposit";
  }
}

export class WithdrawStatus extends TransactionStatus {
  value: string;

  constructor() {
    super();
    this.value = "withdraw";
  }
}

export class TransferStatus extends TransactionStatus {
  value: string;

  constructor() {
    super();
    this.value = "transfer";
  }
}

export class TransactionFactory {
  static create(status: string) {
    if (status === "deposit") return new DepositStatus();
    if (status === "withdraw") return new WithdrawStatus();
    if (status === "transfer") return new TransferStatus();
    throw new Error();
  }
}
