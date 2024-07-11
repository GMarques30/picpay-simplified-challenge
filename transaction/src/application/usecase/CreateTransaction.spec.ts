import { TransactionRepositoryMemory } from "../../../test/repository/TransactionRepositoryMemory";
import { CreateTransaction } from "./CreateTransaction";
import { GetTransaction } from "./GetTransaction";

test("Deve ser possivel criar uma transaction", async () => {
  const transactionRepository = new TransactionRepositoryMemory();
  const getTransaction = new GetTransaction(transactionRepository);
  const sut = new CreateTransaction(transactionRepository);
  const input = {
    payerId: crypto.randomUUID(),
    payeeId: crypto.randomUUID(),
    amount: 100,
    type: "deposit",
  };
  const output = await sut.execute(input);
  expect(output.transactionId).toBeDefined();
  const outputGetTransaction = await getTransaction.execute({
    transactionId: output.transactionId,
  });
  expect(outputGetTransaction.transactionId).toBe(output.transactionId);
  expect(outputGetTransaction.payerId).toBe(input.payerId);
  expect(outputGetTransaction.payeeId).toBe(input.payeeId);
  expect(outputGetTransaction.amount).toBe(input.amount);
  expect(outputGetTransaction.status).toBe(input.type);
});
