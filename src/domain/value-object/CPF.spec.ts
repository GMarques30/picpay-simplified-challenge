import { CPF } from "./CPF";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve testar se o cpf é válido",
  (cpf: string) => {
    const sut = new CPF(cpf);
    expect(sut.getValue()).toBe(cpf);
  }
);

test.each([
  "",
  null,
  undefined,
  "123456",
  "12345678901234567890",
  "11111111111",
])("Deve testar se o cpf é inválido", (cpf: any) => {
  expect(async () => new CPF(cpf)).rejects.toThrow(new Error("Invalid CPF"));
});
