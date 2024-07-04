import { CPF } from "./CPF";

it.each(["97456321558", "71428793860", "87748248800"])(
  "should test if the cpf is valid",
  (cpf: string) => {
    const sut = new CPF(cpf);
    expect(sut.getValue()).toBe(cpf);
  }
);

it.each(["", null, undefined, "123456", "12345678901234567890", "11111111111"])(
  "should test if the cpf is invalid",
  (cpf: any) => {
    expect(async () => new CPF(cpf)).rejects.toThrow(new Error("Invalid CPF"));
  }
);
