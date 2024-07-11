import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { TransactionRepository } from "../repository/TransactionRepository";
import { CreateTransaction } from "./CreateTransaction";
import { GetTransaction } from "./GetTransaction";

let transactionRepository: TransactionRepository;
let createTransaction: CreateTransaction;
let sut: GetTransaction;

beforeEach(async () => {
  transactionRepository = new TransactionRepositoryMemory();
  createTransaction = new CreateTransaction(transactionRepository);
  sut = new GetTransaction(transactionRepository);
});

test("Deve ser possivel obter uma transaction do tipo deposit", async () => {
  const accountId = crypto.randomUUID();

  const inputCreateTransaction = {
    payerId: accountId,
    payeeId: accountId,
    amount: 100,
    type: "deposit",
  };
  const outputCreateTransaction = await createTransaction.execute(
    inputCreateTransaction
  );
  const outputGetTransaction = await sut.execute(outputCreateTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputCreateTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputCreateTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputCreateTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputCreateTransaction.amount);
  expect(outputGetTransaction.status).toBe(inputCreateTransaction.type);
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel obter uma transaction do tipo withdraw", async () => {
  const accountId = crypto.randomUUID();

  const inputCreateTransaction = {
    payerId: accountId,
    payeeId: accountId,
    amount: 100,
    type: "withdraw",
  };
  const outputCreateTransaction = await createTransaction.execute(
    inputCreateTransaction
  );
  const outputGetTransaction = await sut.execute(outputCreateTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputCreateTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputCreateTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputCreateTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputCreateTransaction.amount);
  expect(outputGetTransaction.status).toBe(inputCreateTransaction.type);
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel obter uma transaction do tipo tranfer", async () => {
  const inputCreateTransaction = {
    payerId: crypto.randomUUID(),
    payeeId: crypto.randomUUID(),
    amount: 100,
    type: "transfer",
  };
  const outputCreateTransaction = await createTransaction.execute(
    inputCreateTransaction
  );
  const outputGetTransaction = await sut.execute(outputCreateTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputCreateTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputCreateTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputCreateTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputCreateTransaction.amount);
  expect(outputGetTransaction.status).toBe(inputCreateTransaction.type);
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});
