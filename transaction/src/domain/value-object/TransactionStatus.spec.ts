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

it("should be possible to create a transaction with pending status", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "pending"
  );
  expect(transactionStatus.value).toBe("pending");
});

it("should be possible to create a transaction with approved status", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "approved"
  );
  expect(transactionStatus.value).toBe("approved");
});

it("should be possible to create a transaction with a rejected status", () => {
  const transactionStatus = TransactionStatusFactory.create(
    transaction,
    "rejected"
  );
  expect(transactionStatus.value).toBe("rejected");
});

it("should not be possible to create a transaction status with an invalid status", () => {
  expect(async () =>
    TransactionStatusFactory.create(transaction, "invalid")
  ).rejects.toThrow(new Error("Invalid status"));
});

it("should be possible to change the status of a transaction from pending to approved", () => {
  transaction.approve();
  expect(transaction.getStatus()).toBe("approved");
});

it("should be possible to change the status of a transaction from pending to rejected", () => {
  transaction.reject();
  expect(transaction.getStatus()).toBe("rejected");
});

it("should not be possible to approve a transaction that has already been approved", () => {
  transaction.approve();
  expect(async () => transaction.approve()).rejects.toThrow(
    new Error("Invalid status")
  );
});

it("should not be possible to reject a transaction that has already been approved", () => {
  transaction.approve();
  expect(async () => transaction.reject()).rejects.toThrow(
    new Error("Invalid status")
  );
});

it("should not be possible to approve a transaction that has already been rejected", () => {
  transaction.reject();
  expect(async () => transaction.approve()).rejects.toThrow(
    new Error("Invalid status")
  );
});

it("should not be possible to reject a transaction that has already been rejected", () => {
  transaction.reject();
  expect(async () => transaction.reject()).rejects.toThrow(
    new Error("Invalid status")
  );
});
