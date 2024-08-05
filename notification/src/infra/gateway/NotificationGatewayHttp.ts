import {
  Input,
  NotificationGateway,
} from "../../application/gateway/NotificationGateway";
import { HttpClient } from "../http/HttpClient";

export class NotificationGatewayHttp implements NotificationGateway {
  constructor(readonly httpClient: HttpClient) {}

  async notify({
    to,
    transactionType,
    transactionStatus,
    amount,
  }: Input): Promise<void> {
    let text = `Hello, your ${transactionType} has been successfully made in the amount of R$${amount}`;
    if (transactionStatus === "rejected") {
      text = `Hello, your ${transactionType} has been rejected.`;
    }
    await this.httpClient.post("https://util.devi.tools/api/v1/notify", {
      from: "example@example.com",
      to,
      subject: `${transactionType} made notification`,
      text,
    });
  }
}
