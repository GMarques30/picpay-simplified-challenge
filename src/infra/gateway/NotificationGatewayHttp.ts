import { NotificationGateway } from "../../application/gateway/NotificationGateway";
import { HttpClient } from "../http/HttpClient";

export class NotificationGatewayHttp implements NotificationGateway {
  constructor(readonly httpClient: HttpClient) {}

  async notify(email: string): Promise<void> {
    const response = await this.httpClient.post(
      "https://util.devi.tools/api/v1/notify",
      email
    );
    if (response.status === "fail") throw new Error("Notification not sent");
  }
}
