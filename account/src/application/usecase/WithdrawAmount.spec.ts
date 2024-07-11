import { WithdrawAmount } from "./WithdrawAmount";
import { DepositAmount } from "./DepositAmount";
import { GetAccount } from "./GetAccount";
import { CreateAccount } from "./CreateAccount";
import { AccountRepository } from "./../repository/AccountRepository";
import { AccountRepositoryMemory } from "./../../../test/repository/AccountRepositoryMemory";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let depositAmount: DepositAmount;
let sut: WithdrawAmount;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository);
  sut = new WithdrawAmount(accountRepository);
});

test("Deve ser possivel retirar um montante da conta de um cliente", async () => {
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
  await depositAmount.execute(inputDepositAmount);
  const inputWithdrawAmount = {
    accountId: outputCreateAccount.accountId,
    amount: 50,
  };
  await sut.execute(inputWithdrawAmount);
  const outputGetAccountBefore = await getAccount.execute(inputGetAccount);
  expect(outputGetAccountBefore.balance).toBe(50);
});

test("Não deve ser possivel retirar um montante com saldo insuficiente", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  const inputDepositAmount = {
    accountId: outputCreateAccount.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputWithdrawAmount = {
    accountId: outputCreateAccount.accountId,
    amount: 200,
  };
  expect(async () => await sut.execute(inputWithdrawAmount)).rejects.toThrow(
    new Error("Insufficient balance")
  );
});

test("Não deve ser possivel retirar com um montante invalido", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  const inputDepositAmount = {
    accountId: outputCreateAccount.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputWithdrawAmount = {
    accountId: outputCreateAccount.accountId,
    amount: -100,
  };
  expect(async () => await sut.execute(inputWithdrawAmount)).rejects.toThrow(
    new Error("Invalid withdraw")
  );
});

test("Não deve ser possivel fazer uma retirada em uma conta inexistente", () => {
  const input = {
    accountId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
