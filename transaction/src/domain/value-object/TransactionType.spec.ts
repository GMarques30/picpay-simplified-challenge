import {
  DepositType,
  TransactionTypeFactory,
  TransferType,
  WithdrawType,
} from "./TransactionType";

test("Deve ser possivel criar um transaction type do tipo deposit", () => {
  const output = TransactionTypeFactory.create("deposit");
  expect(output).toBeInstanceOf(DepositType);
  expect(output.value).toBe("deposit");
});

test("Deve ser possivel criar um transaction type do tipo withdraw", () => {
  const output = TransactionTypeFactory.create("withdraw");
  expect(output).toBeInstanceOf(WithdrawType);
  expect(output.value).toBe("withdraw");
});

test("Deve ser possivel criar um transaction type do tipo transfer", () => {
  const output = TransactionTypeFactory.create("transfer");
  expect(output).toBeInstanceOf(TransferType);
  expect(output.value).toBe("transfer");
});

test("Não deve ser possiver criar um transaction type se ele não existir", () => {
  expect(async () => TransactionTypeFactory.create("pix")).rejects.toThrow(
    new Error("Invalid type")
  );
});
