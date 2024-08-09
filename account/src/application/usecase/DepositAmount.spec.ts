import { DepositAmount } from "./DepositAmount";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";
import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/Queue";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let queue: Queue;
let sut: DepositAmount;

beforeEach(() => {
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
  };
  sut = new DepositAmount(accountRepository, queue);
});

it("should be possible to deposit an amount into a customer's account", async () => {
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

  expect(queue.publish).toHaveBeenCalledWith("depositPlaced", {
    to: inputCreateAccount.email,
    payerId: outputCreateAccount.accountId,
    payeeId: outputCreateAccount.accountId,
    amount: 100,
    type: "deposit",
  });
});

it("should not be possible to make a deposit with an invalid amount", async () => {
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

it("should not be possible to make a deposit into a non-existent account", () => {
  const input = {
    accountId: crypto.randomUUID(),
    amount: 100,
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("Account not found")
  );
});
