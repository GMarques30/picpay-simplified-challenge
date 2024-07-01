import { CNPJ } from "./CNPJ";

test.each(["90689024000192", "16422162000158", "63639564000199"])(
  "Deve testar se o CNPJ é válido",
  (cnpj: string) => {
    const sut = new CNPJ(cnpj);
    expect(sut.getValue()).toBe(cnpj);
  }
);

test.each([
  "",
  null,
  undefined,
  "90689024000185",
  "16422162000107",
  "63639564000115",
  "1234567890",
  "123456789012345678901",
  "11111111111111",
])("Deve testar se o CNPJ é inválido", (cnpj: any) => {
  expect(async () => new CNPJ(cnpj)).rejects.toThrow(new Error("Invalid CNPJ"));
});
