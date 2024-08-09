import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/Queue";
import { AccountRepository } from "../repository/AccountRepository";
import { CreateAccount } from "./CreateAccount";
import { GetAccount } from "./GetAccount";
import { DepositAmount } from "./DepositAmount";
import { TransferAmount } from "./TransferAmount";
import { CancelTransfer } from "./CancelTransfer";

let queue: Queue;
let accountRepository: AccountRepository;
let getAccount: GetAccount;
let createAccount: CreateAccount;
let depositAmount: DepositAmount;
let transferAmount: TransferAmount;
let sut: CancelTransfer;

beforeEach(() => {
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
  };
  accountRepository = new AccountRepositoryMemory();
  getAccount = new GetAccount(accountRepository);
  createAccount = new CreateAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository, queue);
  transferAmount = new TransferAmount(accountRepository, queue);
  sut = new CancelTransfer(accountRepository);
});

it("should be possible to cancel a transfer", async () => {
  const inputCreateAccount1 = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount1 = await createAccount.execute(inputCreateAccount1);
  const inputCreateAccount2 = {
    name: "John Doe",
    document: "98765432100",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount2 = await createAccount.execute(inputCreateAccount2);
  const inputDepositAmount = {
    accountId: outputCreateAccount1.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  await transferAmount.execute({
    payerId: outputCreateAccount1.accountId,
    payeeId: outputCreateAccount2.accountId,
    amount: 50,
  });
  const outputGetAccount1After = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1After.balance).toBe(50);
  const outputGetAccount2After = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2After.balance).toBe(50);
  await sut.execute({
    payerId: outputCreateAccount1.accountId,
    payeeId: outputCreateAccount2.accountId,
    amount: 50,
  });
  const outputGetAccount1Before = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1Before.balance).toBe(100);
  const outputGetAccount2Before = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2Before.balance).toBe(0);
});

it("should not be possible to cancel a deposit from a non-existent account", async () => {
  expect(
    async () =>
      await sut.execute({
        payerId: crypto.randomUUID(),
        payeeId: crypto.randomUUID(),
        amount: 100,
      })
  ).rejects.toThrow(new Error("Account not found"));
});
