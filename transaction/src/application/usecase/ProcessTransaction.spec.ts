import { AuthorizeGateway } from "./../gateway/AuthorizeGateway";
import { HttpClient } from "./../../infra/http/HttpClient";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { AuthorizeGatewayHttp } from "../../infra/gateway/AuthorizeGatewayHttp";
import { GetTransaction } from "./GetTransaction";
import { ProcessTransaction } from "./ProcessTransaction";
import { TransactionRepository } from "../repository/TransactionRepository";
import { Queue } from "../queue/queue";

let httpClient: HttpClient;
let queue: Queue;
let authorizeGateway: AuthorizeGateway;
let transactionRepository: TransactionRepository;
let getTransaction: GetTransaction;
let sut: ProcessTransaction;

beforeEach(() => {
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
  getTransaction = new GetTransaction(transactionRepository);
  sut = new ProcessTransaction(transactionRepository, authorizeGateway, queue);
});

test("Deve ser possivel criar uma transaction aprovada", async () => {
  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });
  const input = {
    to: `johndoe${Math.random()}@example.com`,
    payerId: crypto.randomUUID(),
    payeeId: crypto.randomUUID(),
    amount: 100,
    type: "deposit",
  };
  const output = await sut.execute(input);
  expect(output.transactionId).toBeDefined();
  expect(queue.publish).toHaveBeenCalledWith("transactionApproved", {
    to: input.to,
    transactionType: input.type,
    transactionStatus: "approved",
    amount: input.amount,
  });
  const outputGetTransaction = await getTransaction.execute({
    transactionId: output.transactionId,
  });
  expect(outputGetTransaction.transactionId).toBe(output.transactionId);
  expect(outputGetTransaction.payerId).toBe(input.payerId);
  expect(outputGetTransaction.payeeId).toBe(input.payeeId);
  expect(outputGetTransaction.amount).toBe(input.amount);
  expect(outputGetTransaction.type).toBe(input.type);
  expect(outputGetTransaction.status).toBe("approved");
});

test("Deve ser possivel criar uma transaction rejeitada", async () => {
  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "fail",
    data: {
      authorization: false,
    },
  });
  const input = {
    to: `johndoe${Math.random()}@example.com`,
    payerId: crypto.randomUUID(),
    payeeId: crypto.randomUUID(),
    amount: 100,
    type: "deposit",
  };
  const output = await sut.execute(input);
  expect(output.transactionId).toBeDefined();
  expect(queue.publish).toHaveBeenCalledWith("transactionRejected", {
    to: input.to,
    payerId: input.payerId,
    payeeId: input.payeeId,
    transactionType: input.type,
    transactionStatus: "rejected",
    amount: input.amount,
  });
  const outputGetTransaction = await getTransaction.execute({
    transactionId: output.transactionId,
  });
  expect(outputGetTransaction.transactionId).toBe(output.transactionId);
  expect(outputGetTransaction.payerId).toBe(input.payerId);
  expect(outputGetTransaction.payeeId).toBe(input.payeeId);
  expect(outputGetTransaction.amount).toBe(input.amount);
  expect(outputGetTransaction.type).toBe(input.type);
  expect(outputGetTransaction.status).toBe("rejected");
});
