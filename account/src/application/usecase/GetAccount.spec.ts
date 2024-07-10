import { AccountRepositoryMemory } from "./../../../test/repository/AccountRepositoryMemory";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionGatewayHttp } from "../../infra/gateway/TransactionGatewayHttp";
import { HttpClient, AxiosAdapter } from "../../infra/http/HttpClient";

let httpClient: HttpClient;
let transactionGateway: TransactionGateway;
let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let sut: GetAccount;

beforeEach(() => {
  httpClient = new AxiosAdapter();
  transactionGateway = new TransactionGatewayHttp(httpClient);
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository, transactionGateway);
  sut = new GetAccount(accountRepository);

  jest.spyOn(httpClient, "post").mockResolvedValue({});
});

it("should be possible to obtain user data", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  expect(outputCreateAccount.accountId).toBeDefined();
  const outputGetAccount = await sut.execute({
    accountId: outputCreateAccount.accountId,
  });
  expect(outputGetAccount.accountId).toBe(outputCreateAccount.accountId);
  expect(outputGetAccount.name).toBe(inputCreateAccount.name);
  expect(outputGetAccount.email).toBe(inputCreateAccount.email);
  expect(outputGetAccount.document).toBe(inputCreateAccount.document);
  expect(outputGetAccount.password).toEqual(expect.any(String));
});

it("should not be possible to get the data of a user who doesn't exist", async () => {
  const input = {
    accountId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
