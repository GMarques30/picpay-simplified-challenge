export interface NotificationGateway {
  notify(email: string): Promise<void>;
}
