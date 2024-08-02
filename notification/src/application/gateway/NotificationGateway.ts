export interface NotificationGateway {
  notify(input: Input): Promise<void>;
}

export type Input = {
  to: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
};
