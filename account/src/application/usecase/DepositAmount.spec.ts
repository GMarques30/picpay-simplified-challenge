import { DepositAmount } from "./DepositAmount";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";
import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let sut: DepositAmount;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  sut = new DepositAmount(accountRepository);
});

test("Deve ser possivel depositar um valor na conta de um cliente", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  const inputGetAccount = {
    accountId: outputCreateAccount.accountId,
  };
  const outputGetAccountAfter = await getAccount.execute(inputGetAccount);
  expect(outputGetAccountAfter.balance).toBe(0);
  const inputDepositAmount = {
    accountId: outputCreateAccount.accountId,
    amount: 100,
  };
  await sut.execute(inputDepositAmount);
  const outputGetAccountBefore = await getAccount.execute(inputGetAccount);
  expect(outputGetAccountBefore.balance).toBe(100);
});

test("Não deve ser possivel realizar um deposito com um montante invalido", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  const inputDepositAmount = {
    accountId: outputCreateAccount.accountId,
    amount: -100,
  };
  expect(async () => await sut.execute(inputDepositAmount)).rejects.toThrow(
    new Error("Invalid deposit")
  );
});

test("Não deve ser possivel fazer um deposito em uma conta inexistente", () => {
  const input = {
    accountId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
