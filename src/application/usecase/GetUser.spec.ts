import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { CreateUser } from "./CreateUser";
import { GetUser } from "./GetUser";

test("Deve ser possivel obter os dados do usuario", async () => {
  const userRepository = new UserRepositoryMemory();
  const createUser = new CreateUser(userRepository);
  const inputCreateUser = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const outputCreateUser = await createUser.execute(inputCreateUser);
  expect(outputCreateUser.userId).toBeDefined();
  const sut = new GetUser(userRepository);
  const inputGetUser = {
    userId: outputCreateUser.userId,
  };
  const outputGetUser = await sut.execute(inputGetUser);
  expect(outputGetUser.userId).toBe(outputCreateUser.userId);
  expect(outputGetUser.name).toBe(inputCreateUser.name);
  expect(outputGetUser.email).toBe(inputCreateUser.email);
  expect(outputGetUser.document).toBe(inputCreateUser.document);
  expect(outputGetUser.password).toBe(inputCreateUser.password);
});

test("Não deve ser possivel obter os dados de um usuario que não existe", async () => {
  const userRepository = new UserRepositoryMemory();
  const sut = new GetUser(userRepository);
  const input = {
    userId: crypto.randomUUID(),
  };
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("User does not exists")
  );
});
