import { GetAccount } from "./GetAccount";
import { CreateAccount } from "./CreateAccount";
import { DepositAmount } from "./DepositAmount";
import { TransferAmount } from "./TransferAmount";
import { AccountRepository } from "../repository/AccountRepository";
import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";
import { Queue } from "../queue/Queue";

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let depositAmount: DepositAmount;
let queue: Queue;
let sut: TransferAmount;

beforeEach(() => {
  queue = {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
    close: jest.fn(),
  };
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository, queue);
  sut = new TransferAmount(accountRepository, queue);
});

it("should be possible to make a transfer between two clients", async () => {
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
  const inputTransferAmount = {
    payerId: outputCreateAccount1.accountId,
    payeeId: outputCreateAccount2.accountId,
    amount: 50,
  };
  await sut.execute(inputTransferAmount);
  expect(queue.publish).toHaveBeenCalledWith("transferPlaced", {
    to: inputCreateAccount1.email,
    payerId: inputTransferAmount.payerId,
    payeeId: inputTransferAmount.payeeId,
    amount: inputTransferAmount.amount,
    type: "transfer",
  });
  const outputGetAccount1 = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1.balance).toBe(50);
  const outputGetAccount2 = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2.balance).toBe(50);
});

it("should be possible to make a transfer between a payer of type customer and a payee of type seller", async () => {
  const inputCreateAccount1 = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount1 = await createAccount.execute(inputCreateAccount1);
  const inputCreateAccount2 = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount2 = await createAccount.execute(inputCreateAccount2);
  const inputDepositAmount = {
    accountId: outputCreateAccount1.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateAccount1.accountId,
    payeeId: outputCreateAccount2.accountId,
    amount: 90,
  };
  await sut.execute(inputTransferAmount);
  expect(queue.publish).toHaveBeenCalledWith("transferPlaced", {
    to: inputCreateAccount1.email,
    payerId: inputTransferAmount.payerId,
    payeeId: inputTransferAmount.payeeId,
    amount: inputTransferAmount.amount,
    type: "transfer",
  });
  const outputGetAccount1 = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1.balance).toBe(10);
  const outputGetAccount2 = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2.balance).toBe(90);
});

it("should not be possible to make a transfer if the payer is a seller", async () => {
  const inputCreateAccount1 = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount1 = await createAccount.execute(inputCreateAccount1);
  const inputCreateAccount2 = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount2 = await createAccount.execute(inputCreateAccount2);
  const inputDepositAmount = {
    accountId: outputCreateAccount1.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateAccount1.accountId,
    payeeId: outputCreateAccount2.accountId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Sellers cannot make transfers")
  );
});

it("should not be possible to make a transfer if the payee is non-existing", async () => {
  const inputCreateAccount1 = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "Abc@123",
  };
  const outputCreateAccount1 = await createAccount.execute(inputCreateAccount1);
  const inputDepositAmount = {
    accountId: outputCreateAccount1.accountId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateAccount1.accountId,
    payeeId: crypto.randomUUID(),
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Account not found")
  );
});
