import { CNPJ } from "./CNPJ";

it.each(["90689024000192", "16422162000158", "63639564000199"])(
  "should test whether the CNPJ is valid",
  (cnpj: string) => {
    const sut = new CNPJ(cnpj);
    expect(sut.getValue()).toBe(cnpj);
  }
);

it.each([
  "",
  null,
  undefined,
  "90689024000185",
  "16422162000107",
  "63639564000115",
  "1234567890",
  "123456789012345678901",
  "11111111111111",
])("should test if the CNPJ is invalid", (cnpj: any) => {
  expect(async () => new CNPJ(cnpj)).rejects.toThrow(new Error("Invalid CNPJ"));
});
