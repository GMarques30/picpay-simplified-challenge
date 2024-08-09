import { SendNotification } from "./application/usecase/SendNotification";
import { NotificationGatewayHttp } from "./infra/gateway/NotificationGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { QueueController } from "./infra/queue/QueueController";
import "dotenv/config";

(async () => {
  const httpClient = new AxiosAdapter();
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const notificationGateway = new NotificationGatewayHttp(httpClient);
  const sendNotification = new SendNotification(notificationGateway);
  new QueueController(queue, sendNotification);
  httpServer.listen(Number(process.env.PORT));
})();
