import { Name } from "./Name";

it.each([
  "John Doe",
  "John Michael Doe",
  "John Michael Alexander Doe",
  "John Michael Alexander Thomas Doe",
])("should be possible to create a name", (name: string) => {
  const sut = new Name(name);
  expect(sut.getValue()).toBe(name);
});

it.each(["", "John", "123", "123 456"])(
  "should not be possible to create a name",
  (name: string) => {
    expect(async () => new Name(name)).rejects.toThrow(
      new Error("Invalid name")
    );
  }
);
