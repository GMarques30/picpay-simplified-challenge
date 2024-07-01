import { Name } from "./Name";

test.each([
  "John Doe",
  "John Michael Doe",
  "John Michael Alexander Doe",
  "John Michael Alexander Thomas Doe",
])("Deve ser possivel criar um nome", (name: string) => {
  const sut = new Name(name);
  expect(sut.getValue()).toBe(name);
});

test.each(["", "John", "123", "123 456"])(
  "Não deve ser possivel criar um nome",
  (name: string) => {
    expect(async () => new Name(name)).rejects.toThrow(
      new Error("Invalid name")
    );
  }
);
