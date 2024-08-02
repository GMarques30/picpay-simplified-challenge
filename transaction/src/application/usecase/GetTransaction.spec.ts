import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { AuthorizeGatewayHttp } from "../../infra/gateway/AuthorizeGatewayHttp";
import { HttpClient } from "../../infra/http/HttpClient";
import { AuthorizeGateway } from "../gateway/AuthorizeGateway";
import { Queue } from "../queue/queue";
import { TransactionRepository } from "../repository/TransactionRepository";
import { GetTransaction } from "./GetTransaction";
import { ProcessTransaction } from "./ProcessTransaction";

let httpClient: HttpClient;
let queue: Queue;
let authorizeGateway: AuthorizeGateway;
let transactionRepository: TransactionRepository;
let processTransaction: ProcessTransaction;
let sut: GetTransaction;

beforeEach(async () => {
  httpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
    setup: jest.fn(),
  };
  authorizeGateway = new AuthorizeGatewayHttp(httpClient);
  transactionRepository = new TransactionRepositoryMemory();
  processTransaction = new ProcessTransaction(
    transactionRepository,
    authorizeGateway,
    queue
  );
  sut = new GetTransaction(transactionRepository);
});

test("Deve ser possivel obter uma transaction do tipo deposit", async () => {
  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });
  const accountId = crypto.randomUUID();
  const inputProcessTransaction = {
    to: `johndoe${Math.random()}@example.com`,
    payerId: accountId,
    payeeId: accountId,
    amount: 100,
    type: "deposit",
  };
  const outputProcessTransaction = await processTransaction.execute(
    inputProcessTransaction
  );
  const outputGetTransaction = await sut.execute(outputProcessTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputProcessTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputProcessTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputProcessTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputProcessTransaction.amount);
  expect(outputGetTransaction.type).toBe(inputProcessTransaction.type);
  expect(outputGetTransaction.status).toBe("approved");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel obter uma transaction do tipo withdraw", async () => {
  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });
  const accountId = crypto.randomUUID();
  const inputProcessTransaction = {
    to: `johndoe${Math.random()}@example.com`,
    payerId: accountId,
    payeeId: accountId,
    amount: 100,
    type: "withdraw",
  };
  const outputProcessTransaction = await processTransaction.execute(
    inputProcessTransaction
  );
  const outputGetTransaction = await sut.execute(outputProcessTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputProcessTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputProcessTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputProcessTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputProcessTransaction.amount);
  expect(outputGetTransaction.type).toBe(inputProcessTransaction.type);
  expect(outputGetTransaction.status).toBe("approved");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel obter uma transaction do tipo tranfer", async () => {
  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });
  const inputProcessTransaction = {
    to: `johndoe${Math.random()}@example.com`,
    payerId: crypto.randomUUID(),
    payeeId: crypto.randomUUID(),
    amount: 100,
    type: "transfer",
  };
  const outputProcessTransaction = await processTransaction.execute(
    inputProcessTransaction
  );
  const outputGetTransaction = await sut.execute(outputProcessTransaction);
  expect(outputGetTransaction.transactionId).toBe(
    outputProcessTransaction.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputProcessTransaction.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputProcessTransaction.payeeId);
  expect(outputGetTransaction.amount).toBe(inputProcessTransaction.amount);
  expect(outputGetTransaction.type).toBe(inputProcessTransaction.type);
  expect(outputGetTransaction.status).toBe("approved");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Não deve ser possivel obter uma transaction inexistente", async () => {
  expect(
    async () =>
      await sut.execute({
        transactionId: crypto.randomUUID(),
      })
  ).rejects.toThrow(new Error("Transaction not found"));
});
