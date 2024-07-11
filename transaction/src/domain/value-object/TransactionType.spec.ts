import {
  DepositType,
  TransactionFactory,
  TransferType,
  WithdrawType,
} from "./TransactionType";

test("Deve ser possivel criar um status do tipo deposit", () => {
  const output = TransactionFactory.create("deposit");
  expect(output).toBeInstanceOf(DepositType);
  expect(output.value).toBe("deposit");
});

test("Deve ser possivel criar um status do tipo withdraw", () => {
  const output = TransactionFactory.create("withdraw");
  expect(output).toBeInstanceOf(WithdrawType);
  expect(output.value).toBe("withdraw");
});

test("Deve ser possivel criar um status do tipo transfer", () => {
  const output = TransactionFactory.create("transfer");
  expect(output).toBeInstanceOf(TransferType);
  expect(output.value).toBe("transfer");
});

test("Não deve ser possiver criar um status se ele não existir", () => {
  expect(async () => TransactionFactory.create("pix")).rejects.toThrow(
    new Error()
  );
});
