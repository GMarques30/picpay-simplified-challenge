import { WithdrawAmount } from "./WithdrawAmount";
import { DepositAmount } from "./DepositAmount";
import { GetAccount } from "./GetAccount";
import { CreateAccount } from "./CreateAccount";
import { AccountRepository } from "./../repository/AccountRepository";
import { AccountRepositoryMemory } from "./../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/queue";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let depositAmount: DepositAmount;
let queue: Queue;
let sut: WithdrawAmount;

beforeEach(() => {
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
    setup: jest.fn(),
  };
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository, queue);
  sut = new WithdrawAmount(accountRepository, queue);
});

it("should be possible to withdraw an amount from a customers account", async () => {
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
  expect(queue.publish).toHaveBeenCalledWith("withdrawPlaced", {
    to: inputCreateAccount.email,
    payerId: outputCreateAccount.accountId,
    payeeId: outputCreateAccount.accountId,
    amount: 50,
    type: "withdraw",
  });
});

it("should not be possible to withdraw an amount with an insufficient balance", async () => {
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

it("should not be possible to withdraw with an invalid amount", async () => {
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

it("should not be possible to withdraw from a non-existent account", () => {
  const input = {
    accountId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
