import {
  DepositType,
  TransactionTypeFactory,
  TransferType,
  WithdrawType,
} from "./TransactionType";

it("should be possible to create a transaction type like deposit", () => {
  const output = TransactionTypeFactory.create("deposit");
  expect(output).toBeInstanceOf(DepositType);
  expect(output.value).toBe("deposit");
});

it("should be possible to create a transaction type of withdraw type", () => {
  const output = TransactionTypeFactory.create("withdraw");
  expect(output).toBeInstanceOf(WithdrawType);
  expect(output.value).toBe("withdraw");
});

it("should be possible to create a transaction type of the transfer type", () => {
  const output = TransactionTypeFactory.create("transfer");
  expect(output).toBeInstanceOf(TransferType);
  expect(output.value).toBe("transfer");
});

it("should not be able to create a transaction type if it doesn't exist", () => {
  expect(async () => TransactionTypeFactory.create("pix")).rejects.toThrow(
    new Error("Invalid type")
  );
});
