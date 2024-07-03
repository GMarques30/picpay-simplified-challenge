import { NotificationGateway } from "../../src/application/gateway/NotificationGateway";

export class NotificationGatewayFake implements NotificationGateway {
  async notify(email: string): Promise<void> {
    console.log(`Message sent to ${email}`);
  }
}
