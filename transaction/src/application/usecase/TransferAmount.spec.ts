import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { NotificationGatewayHttp } from "../../infra/gateway/NotificationGatewayHttp";
import { TransactionGatewayHttp } from "../../infra/gateway/TransactionGatewayHttp";
import { HttpClient } from "../../infra/http/HttpClient";
import { AccountGateway } from "../gateway/AccountGateway";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { TransactionGateway } from "../gateway/TransactionGateway";
import { TransactionRepository } from "../repository/TransactionRepository";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateWallet } from "./CreateWallet";
import { DepositAmount } from "./DepositAmount";
import { GetTransaction } from "./GetTransaction";
import { GetWallet } from "./GetWallet";
import { TransferAmount } from "./TransferAmount";

jest.mock("../../infra/http/HttpClient");

let httpClient: HttpClient;
let walletRepository: WalletRepository;
let transactionRepository: TransactionRepository;
let transactionGateway: TransactionGateway;
let notificationGateway: NotificationGateway;
let accountGateway: AccountGateway;
let createWallet: CreateWallet;
let getWallet: GetWallet;
let depositAmount: DepositAmount;
let getTransaction: GetTransaction;
let sut: TransferAmount;

beforeEach(() => {
  httpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };
  accountGateway = {
    createAccount: jest.fn(),
    getByAccountId: jest.fn(),
  };
  walletRepository = new WalletRepositoryMemory();
  transactionRepository = new TransactionRepositoryMemory();
  transactionGateway = new TransactionGatewayHttp(httpClient);
  notificationGateway = new NotificationGatewayHttp(httpClient);
  createWallet = new CreateWallet(walletRepository);
  getWallet = new GetWallet(walletRepository);
  depositAmount = new DepositAmount(walletRepository, transactionRepository);
  getTransaction = new GetTransaction(transactionRepository);
  sut = new TransferAmount(
    walletRepository,
    transactionRepository,
    transactionGateway,
    notificationGateway,
    accountGateway
  );
});

test("Deve ser possivel realizar uma transferencia entre dois clientes", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      message: "Notification sent",
    },
  });

  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });

  (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
    document: "12345678909",
  });

  const inputCreateWallet1 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet1 = await createWallet.execute(inputCreateWallet1);
  const inputCreateWallet2 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet2 = await createWallet.execute(inputCreateWallet2);
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  const outputTransferAmount = await sut.execute(inputTransferAmount);
  expect(outputTransferAmount.transactionId).toBeDefined();
  const outputGetWallet1 = await getWallet.execute({
    accountId: inputCreateWallet1.accountId,
  });
  expect(outputGetWallet1.balance).toBe(50);
  const outputGetWallet2 = await getWallet.execute({
    accountId: inputCreateWallet2.accountId,
  });
  expect(outputGetWallet2.balance).toBe(50);
  const inputGetTransaction = {
    transactionId: outputTransferAmount.transactionId,
  };
  const outputGetTransaction = await getTransaction.execute(
    inputGetTransaction
  );
  expect(outputGetTransaction.transactionId).toBe(
    outputTransferAmount.transactionId
  );
  expect(outputGetTransaction.payerId).toBe(inputTransferAmount.payerId);
  expect(outputGetTransaction.payeeId).toBe(inputTransferAmount.payeeId);
  expect(outputGetTransaction.amount).toBe(inputTransferAmount.amount);
  expect(outputGetTransaction.status).toBe("transfer");
  expect(outputGetTransaction.occuredAt).toEqual(expect.any(Date));
});

test("Deve ser possivel realizar uma transferencia entre um pagador do tipo cliente e um recebedor do tipo lojista", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      message: "Notification sent",
    },
  });

  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });

  (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
    document: "12345678909",
  });

  const inputCreateWallet1 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet1 = await createWallet.execute(inputCreateWallet1);
  const inputCreateWallet2 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet2 = await createWallet.execute(inputCreateWallet2);
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 90,
  };
  const outputTransferAmount = await sut.execute(inputTransferAmount);
  expect(outputTransferAmount.transactionId).toBeDefined();
  const outputGetWallet1 = await getWallet.execute({
    accountId: inputCreateWallet1.accountId,
  });
  expect(outputGetWallet1.balance).toBe(10);
  const outputGetWallet2 = await getWallet.execute({
    accountId: inputCreateWallet2.accountId,
  });
  expect(outputGetWallet2.balance).toBe(90);
});

test("Não deve ser possivel realizar uma transferencia se o pagador for do tipo lojista", async () => {
  (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
    document: "90689024000192",
  });

  const inputCreateWallet1 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet1 = await createWallet.execute(inputCreateWallet1);
  const inputCreateWallet2 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet2 = await createWallet.execute(inputCreateWallet2);
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Sellers cannot make transfers")
  );
});

test("Não deve ser possivel realizar uma transferencia se ela não foi autorizada", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      message: "Notification sent",
    },
  });

  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "fail",
    data: {
      authorization: false,
    },
  });

  (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
    document: "12345678909",
  });
  const inputCreateWallet1 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet1 = await createWallet.execute(inputCreateWallet1);
  const inputCreateWallet2 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet2 = await createWallet.execute(inputCreateWallet2);
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Unauthorized transaction")
  );
});

test("Não deve ser possivel enviar uma notificação", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "fail",
    data: {
      message: "Notification not sent",
    },
  });

  (httpClient.get as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      authorization: true,
    },
  });

  (accountGateway.getByAccountId as jest.Mock).mockResolvedValue({
    document: "12345678909",
  });

  const inputCreateWallet1 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet1 = await createWallet.execute(inputCreateWallet1);
  const inputCreateWallet2 = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet2 = await createWallet.execute(inputCreateWallet2);
  const inputDepositAmount = {
    walletId: outputCreateWallet1.walletId,
    amount: 100,
  };
  await depositAmount.execute(inputDepositAmount);
  const inputTransferAmount = {
    payerId: outputCreateWallet1.walletId,
    payeeId: outputCreateWallet2.walletId,
    amount: 50,
  };
  expect(async () => await sut.execute(inputTransferAmount)).rejects.toThrow(
    new Error("Notification not sent")
  );
});
