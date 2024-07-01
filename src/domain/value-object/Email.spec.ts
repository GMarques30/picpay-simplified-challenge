import { Email } from "./Email";

test.each(["john@example.com", "johndoe@exampple.com", "doe@example.com.br"])(
  "Deve testar se o email é válido",
  (email: string) => {
    const sut = new Email(email);
    expect(sut.getValue()).toBe(email);
  }
);

test.each([
  "",
  "johndoe",
  "johndoe@",
  "johndoe@example",
  "johndoe@.com",
  "@example.com",
])("Deve testar se o email é inválido", (email: any) => {
  expect(async () => new Email(email)).rejects.toThrow(
    new Error("Invalid email")
  );
});
