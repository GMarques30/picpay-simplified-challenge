import { UserRepositoryMemory } from "../../../test/repository/UserRepositoryMemory";
import { UserRepository } from "../repository/UserRepository";
import { CreateUser } from "./CreateUser";

let userRepository: UserRepository;
let sut: CreateUser;

beforeEach(() => {
  userRepository = new UserRepositoryMemory();
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
});

it("Deve ser possivel criar um usuario vendedor", async () => {
  const input = {
    name: "John Doe",
    document: "90689024000192",
    email: `johndoe${Math.random()}@example.com`,
    password: "123456",
  };
  const output = await sut.execute(input);
  expect(output.userId).toBeDefined();
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
