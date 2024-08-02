import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/queue";
import { AccountRepository } from "../repository/AccountRepository";
import { CancelDeposit } from "./CancelDeposit";
import { CreateAccount } from "./CreateAccount";
import { DepositAmount } from "./DepositAmount";
import { GetAccount } from "./GetAccount";

let queue: Queue;
let accountRepository: AccountRepository;
let getAccount: GetAccount;
let createAccount: CreateAccount;
let depositAmount: DepositAmount;
let sut: CancelDeposit;

beforeEach(() => {
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
    setup: jest.fn(),
  };
  accountRepository = new AccountRepositoryMemory();
  getAccount = new GetAccount(accountRepository);
  createAccount = new CreateAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository, queue);
  sut = new CancelDeposit(accountRepository);
});

test("Deve ser possivel cancelar um deposito", async () => {
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
  const outputGetAccountAfter = await getAccount.execute({
    accountId: outputCreateAccount.accountId,
  });
  expect(outputGetAccountAfter.balance).toBe(100);
  await sut.execute({
    payerId: outputCreateAccount.accountId,
    amount: 100,
  });
  const outputGetAccountBefore = await getAccount.execute({
    accountId: outputCreateAccount.accountId,
  });
  expect(outputGetAccountBefore.balance).toBe(0);
});

test("Não deve ser possivel cancelar o deposito de uma conta inexistente", async () => {
  expect(
    async () =>
      await sut.execute({
        payerId: crypto.randomUUID(),
        amount: 100,
      })
  ).rejects.toThrow(new Error("Account not found"));
});
