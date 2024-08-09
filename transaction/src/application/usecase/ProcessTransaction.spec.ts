import { AuthorizeGateway } from "./../gateway/AuthorizeGateway";
import { HttpClient } from "./../../infra/http/HttpClient";
import { AuthorizeGatewayHttp } from "../../infra/gateway/AuthorizeGatewayHttp";
import { GetTransaction } from "./GetTransaction";
import { ProcessTransaction } from "./ProcessTransaction";
import { TransactionRepository } from "../repository/TransactionRepository";
import { Queue } from "../queue/Queue";
import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";

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
  };
  authorizeGateway = new AuthorizeGatewayHttp(httpClient);
  transactionRepository = new TransactionRepositoryMemory();
  getTransaction = new GetTransaction(transactionRepository);
  sut = new ProcessTransaction(transactionRepository, authorizeGateway, queue);
});

it("should be possible to create an approved transaction", async () => {
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

it("should be possible to create a rejected transaction", async () => {
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
