import { HttpClient } from "./../../../../transaction/src/infra/http/HttpClient";
import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { TransactionGatewayHttp } from "../../infra/gateway/TransactionGatewayHttp";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";
import { AxiosAdapter } from "../../infra/http/HttpClient";

let spy: jest.SpyInstance;
let httpClient: HttpClient;
let transactionGateway: TransactionGateway;
let accountRepository: AccountRepository;
let getAccount: GetAccount;
let sut: CreateAccount;

beforeEach(() => {
  httpClient = new AxiosAdapter();
  transactionGateway = new TransactionGatewayHttp(httpClient);
  accountRepository = new AccountRepositoryMemory();
  getAccount = new GetAccount(accountRepository);
  sut = new CreateAccount(accountRepository, transactionGateway);

  spy = jest.spyOn(httpClient, "post").mockResolvedValue({});
});

it("should be possible to create a customer user", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  const output = await sut.execute(input);
  expect(spy).toHaveBeenCalled();
  expect(output.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute({
    accountId: output.accountId,
  });
  expect(outputGetAccount.accountId).toBe(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.password).toEqual(expect.any(String));
});

it("should be possible to create a seller user", async () => {
  const input = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  const output = await sut.execute(input);
  expect(spy).toHaveBeenCalled();
  expect(output.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute({
    accountId: output.accountId,
  });
  expect(outputGetAccount.accountId).toBe(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.password).toEqual(expect.any(String));
});

it("should not be possible to create a user with the same email address as the one already registered", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  await sut.execute(input);
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("The provided Email is already registered in our system")
  );
});

it("should not be possible to create a user with the same document already registered", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  const otherInput = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "A1b@567",
  };
  await sut.execute(input);
  expect(async () => await sut.execute(otherInput)).rejects.toThrow(
    new Error("The provided CPF/CNPJ is already registered in our system")
  );
});
