import { DocumentFactory } from "./Document";

it.each([
  "97456321558",
  "71428793860",
  "87748248800",
  "52998224725",
  "98765432100",
])("should test if the cpf is valid", (document: string) => {
  const sut = DocumentFactory.create(document);
  expect(sut.getValue()).toBe(document);
});

it.each(["12345678900", "00000000000", "11122233344", "99988877766"])(
  "should test if the CPF is invalid",
  (document: any) => {
    expect(async () => DocumentFactory.create(document)).rejects.toThrow(
      new Error("Invalid CPF")
    );
  }
);

it.each(["90689024000192", "16422162000158", "63639564000199"])(
  "should test whether the CNPJ is valid",
  (document: string) => {
    const sut = DocumentFactory.create(document);
    expect(sut.getValue()).toBe(document);
  }
);

it.each([
  "90689024000185",
  "16422162000107",
  "63639564000115",
  "11111111111111",
])("should test if the CNPJ is invalid", (document: any) => {
  expect(async () => DocumentFactory.create(document)).rejects.toThrow(
    new Error("Invalid CNPJ")
  );
});

it.each(["", null, undefined, "123456", "1234567890", "123456789012345678901"])(
  "should test if the document is invalid",
  (document: any) => {
    expect(async () => DocumentFactory.create(document)).rejects.toThrow(
      new Error("Invalid document")
    );
  }
);
