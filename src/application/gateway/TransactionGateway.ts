export interface TransactionGateway {
  authorize(): Promise<void>;
}
