import { NotificationGatewayHttp } from "../../infra/gateway/NotificationGatewayHttp";
import { HttpClient } from "../../infra/http/HttpClient";
import { RetryImpl } from "../../infra/retry/RetryImpl";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { Retry } from "../retry/Retry";
import { SendNotification } from "./SendNotification";

let httpClient: HttpClient;
let notificationGateway: NotificationGateway;
let retryImpl: Retry;
let sut: SendNotification;

beforeEach(() => {
  httpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };
  notificationGateway = new NotificationGatewayHttp(httpClient);
  retryImpl = new RetryImpl(3, 100);
  sut = new SendNotification(notificationGateway, retryImpl);
});

test("Deve ser possível enviar uma notificação de uma transação aprovada", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      message: "Notification sent",
    },
  });
  const inputSendNotification = {
    to: `johndoe${Math.random()}@example.com`,
    transactionType: "deposit",
    transactionStatus: "approved",
    amount: 100,
  };
  await sut.execute(inputSendNotification);
  expect(httpClient.post).toHaveBeenCalledTimes(1);
});

test("Deve ser possível enviar uma notificação de uma transação rejeitada", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "success",
    data: {
      message: "Notification sent",
    },
  });
  const inputSendNotification = {
    to: `johndoe${Math.random()}@example.com`,
    transactionType: "deposit",
    transactionStatus: "rejected",
    amount: 100,
  };
  await sut.execute(inputSendNotification);
  expect(httpClient.post).toHaveBeenCalledTimes(1);
});

test("Não deve ser possível enviar uma notificação se o serviço falhar", async () => {
  (httpClient.post as jest.Mock).mockResolvedValue({
    status: "fail",
    data: {
      message: "Notification not sent",
    },
  });
  const inputSendNotification = {
    to: `johndoe${Math.random()}@example.com`,
    transactionType: "deposit",
    transactionStatus: "approved",
    amount: 100,
  };
  await sut.execute(inputSendNotification);
  expect(httpClient.post).toHaveBeenCalledTimes(1);
});
