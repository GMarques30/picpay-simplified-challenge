import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { UserRepository } from "../repository/UserRepository";
import { CreateUser } from "./CreateUser";
import { GetUser } from "./GetUser";

let userRepository: UserRepository;
let getUser: GetUser;
let sut: CreateUser;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
  getUser = new GetUser(userRepository);
  sut = new CreateUser(userRepository);
});

it("Deve ser possivel criar um usuario cliente", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const output = await sut.execute(input);
  expect(output.userId).toBeDefined();
  const outputGetUser = await getUser.execute({
    userId: output.userId,
  });
  expect(outputGetUser.userId).toBe(output.userId);
  expect(outputGetUser.name).toBe(input.name);
  expect(outputGetUser.document).toBe(input.document);
  expect(outputGetUser.email).toBe(input.email);
  expect(outputGetUser.password).toBe(input.password);
});

it("Deve ser possivel criar um usuario lojista", async () => {
  const input = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const output = await sut.execute(input);
  expect(output.userId).toBeDefined();
  const outputGetUser = await getUser.execute({
    userId: output.userId,
  });
  expect(outputGetUser.userId).toBe(output.userId);
  expect(outputGetUser.name).toBe(input.name);
  expect(outputGetUser.document).toBe(input.document);
  expect(outputGetUser.email).toBe(input.email);
  expect(outputGetUser.password).toBe(input.password);
});

it("Não deve ser possivel criar um usuario com o mesmo email já cadastrado", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  await sut.execute(input);
  expect(async () => await sut.execute(input)).rejects.toThrow(
    new Error("The provided Email is already registered in our system")
  );
});

it("Não deve ser possivel criar um usuario com o mesmo documento já cadastrado", async () => {
  const input = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const otherInput = {
    name: "John Doe",
    document: "12345678909",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  await sut.execute(input);
  expect(async () => await sut.execute(otherInput)).rejects.toThrow(
    new Error("The provided CPF/CNPJ is already registered in our system")
  );
});
