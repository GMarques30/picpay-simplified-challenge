import { GetAccount } from "./GetAccount";
import { CreateAccount } from "./CreateAccount";
import { DepositAmount } from "./DepositAmount";
import { TransferAmount } from "./TransferAmount";
import { AccountRepository } from "../repository/AccountRepository";
import { AccountRepositoryMemory } from "../../../test/repository/AccountRepositoryMemory";

// jest.mock("../../infra/http/HttpClient");

let accountRepository: AccountRepository;
let createAccount: CreateAccount;
let getAccount: GetAccount;
let depositAmount: DepositAmount;
let sut: TransferAmount;

beforeEach(() => {
  // httpClient = {
  //   get: jest.fn(),
  //   post: jest.fn(),
  // };
  // accountGateway = {
  //   createAccount: jest.fn(),
  //   getByAccountId: jest.fn(),
  // };
  accountRepository = new AccountRepositoryMemory();
  createAccount = new CreateAccount(accountRepository);
  getAccount = new GetAccount(accountRepository);
  depositAmount = new DepositAmount(accountRepository);
  sut = new TransferAmount(accountRepository);
});

test("Deve ser possivel realizar uma transferencia entre dois clientes", async () => {
  // (httpClient.post as jest.Mock).mockResolvedValue({
  //   status: "success",
  //   data: {
  //     message: "Notification sent",
  //   },
  // });

  // (httpClient.get as jest.Mock).mockResolvedValue({
  //   status: "success",
  //   data: {
  //     authorization: true,
  //   },
  // });

  // (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
  //   document: "12345678909",
  // });

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
  const outputGetAccount1 = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1.balance).toBe(50);
  const outputGetAccount2 = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2.balance).toBe(50);
});

test("Deve ser possivel realizar uma transferencia entre um pagador do tipo cliente e um recebedor do tipo lojista", async () => {
  // (httpClient.post as jest.Mock).mockResolvedValue({
  //   status: "success",
  //   data: {
  //     message: "Notification sent",
  //   },
  // });

  // (httpClient.get as jest.Mock).mockResolvedValue({
  //   status: "success",
  //   data: {
  //     authorization: true,
  //   },
  // });

  // (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
  //   document: "12345678909",
  // });

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
  const outputGetAccount1 = await getAccount.execute({
    accountId: outputCreateAccount1.accountId,
  });
  expect(outputGetAccount1.balance).toBe(10);
  const outputGetAccount2 = await getAccount.execute({
    accountId: outputCreateAccount2.accountId,
  });
  expect(outputGetAccount2.balance).toBe(90);
});

test("Não deve ser possivel realizar uma transferencia se o pagador for do tipo lojista", async () => {
  // (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
  //   document: "90689024000192",
  // });

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
