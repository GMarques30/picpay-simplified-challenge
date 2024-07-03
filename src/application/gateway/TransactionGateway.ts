export interface TransactionGateway {
  authorizeTransaction(): Promise<OutputAuthorizeTransaction>;
}

export type OutputAuthorizeTransaction = {
  status: string;
  data: { authorization: boolean };
};
