import { Transaction } from "../entity/Transaction";
import { TransactionStatusFactory } from "./TransactionStatus";

let transaction: Transaction;

beforeEach(() => {
  transaction = Transaction.create(
    crypto.randomUUID(),
    crypto.randomUUID(),
    100,
    "deposit"
  );
});

test("Deve ser possivel criar uma transaction com status pending", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "pending"
  );
  expect(transactionStatus.value).toBe("pending");
});

test("Deve ser possivel criar uma transaction com status approved", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "approved"
  );
  expect(transactionStatus.value).toBe("approved");
});

test("Deve ser possivel criar uma transaction com status rejected", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "rejected"
  );
  expect(transactionStatus.value).toBe("rejected");
});

test("Não deve ser possivel criar uma transaction status com o status inválido", () => {
  expect(async () =>
    TransactionStatusFactory.create(transaction, "invalid")
  ).rejects.toThrow(new Error("Invalid status"));
});

test("Deve ser possivel alterar o status de uma transaction de pending para approved", () => {
  transaction.approve();
  expect(transaction.getStatus()).toBe("approved");
});

test("Deve ser possivel alterar o status de uma transaction de pending para rejected", () => {
  transaction.reject();
  expect(transaction.getStatus()).toBe("rejected");
});

test("Não deve ser possivel aprovar uma transaction já aprovada", () => {
  transaction.approve();
  expect(async () => transaction.approve()).rejects.toThrow(
    new Error("Invalid status")
  );
});

test("Não deve ser possivel rejeitar uma transaction já aprovada", () => {
  transaction.approve();
  expect(async () => transaction.reject()).rejects.toThrow(
    new Error("Invalid status")
  );
});

test("Não deve ser possivel aprovar uma transaction já rejeitada", () => {
  transaction.reject();
  expect(async () => transaction.approve()).rejects.toThrow(
    new Error("Invalid status")
  );
});

test("Não deve ser possivel rejeitar uma transaction já rejeitada", () => {
  transaction.reject();
  expect(async () => transaction.reject()).rejects.toThrow(
    new Error("Invalid status")
  );
});
