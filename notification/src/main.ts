import { SendNotification } from "./application/usecase/SendNotification";
import { NotificationGatewayHttp } from "./infra/gateway/NotificationGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { QueueController } from "./infra/queue/QueueController";

(async () => {
  const httpClient = new AxiosAdapter();
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  const notificationGateway = new NotificationGatewayHttp(httpClient);
  const sendNotification = new SendNotification(notificationGateway);
  new QueueController(queue, sendNotification);
  httpServer.listen(3002);
})();
