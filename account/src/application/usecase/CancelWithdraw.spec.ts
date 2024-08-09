import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/Queue";
import { AccountRepository } from "../repository/AccountRepository";
import { CancelWithdraw } from "./CancelWithdraw";
import { CreateAccount } from "./CreateAccount";
import { WithdrawAmount } from "./WithdrawAmount";
import { GetAccount } from "./GetAccount";
import { DepositAmount } from "./DepositAmount";

let queue: Queue;
let accountRepository: AccountRepository;
let getAccount: GetAccount;
let createAccount: CreateAccount;
let depositAmount: DepositAmount;
let withdrawAmount: WithdrawAmount;
let sut: CancelWithdraw;

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
  withdrawAmount = new WithdrawAmount(accountRepository, queue);
  sut = new CancelWithdraw(accountRepository);
});

it("should be possible to cancel a deposit", async () => {
  const inputCreateAccount = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount = await createAccount.execute(inputCreateAccount);
  await depositAmount.execute({
    accountId: outputCreateAccount.accountId,
    amount: 100,
  });
  await withdrawAmount.execute({
    accountId: outputCreateAccount.accountId,
    amount: 100,
  });
  const outputGetAccountAfter = await getAccount.execute({
    accountId: outputCreateAccount.accountId,
  });
  expect(outputGetAccountAfter.balance).toBe(0);
  await sut.execute({
    payerId: outputCreateAccount.accountId,
    amount: 100,
  });
  const outputGetAccountBefore = await getAccount.execute({
    accountId: outputCreateAccount.accountId,
  });
  expect(outputGetAccountBefore.balance).toBe(100);
});

it("should not be possible to cancel a deposit from a non-existent account", async () => {
  expect(
    async () =>
      await sut.execute({
        payerId: crypto.randomUUID(),
        amount: 100,
      })
  ).rejects.toThrow(new Error("Account not found"));
});
