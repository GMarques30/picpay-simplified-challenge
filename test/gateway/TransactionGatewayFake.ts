import { TransactionGateway } from "../../src/application/gateway/TransactionGateway";

export class TransactionGatewayFake implements TransactionGateway {
  async authorize(): Promise<void> {
    console.log("Authorized");
  }
}
