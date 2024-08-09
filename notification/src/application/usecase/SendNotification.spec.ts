import { NotificationGatewayHttp } from "../../infra/gateway/NotificationGatewayHttp";
import { HttpClient } from "../../infra/http/HttpClient";
import { NotificationGateway } from "../gateway/NotificationGateway";
import { SendNotification } from "./SendNotification";

let httpClient: HttpClient;
let notificationGateway: NotificationGateway;
let sut: SendNotification;

beforeEach(() => {
  httpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };
  notificationGateway = new NotificationGatewayHttp(httpClient);
  sut = new SendNotification(notificationGateway);
});

it("should be possible to send a notification of an approved transaction", async () => {
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

it("should be possible to send a notification of a rejected transaction", async () => {
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

it("should not be possible to send a notification if the service fails", async () => {
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
