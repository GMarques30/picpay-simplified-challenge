import { AccountRepositoryMemory } from "./../../../test/repository/AccountRepositoryMemory";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let sut: GetAccount;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  sut = new GetAccount(accountRepository);
});

it("should be possible to obtain user data", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
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
  expect(outputGetAccount.password).toBe(inputCreateAccount.password);
});

it("should not be possible to get the data of a user who doesn't exist", async () => {
  const sut = new GetAccount(accountRepository);
  const input = {
    accountId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
