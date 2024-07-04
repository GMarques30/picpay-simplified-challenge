import { Email } from "./Email";

it.each(["john@example.com", "johndoe@exampple.com", "doe@example.com.br"])(
  "should need to check that the email is valid",
  (email: string) => {
    const sut = new Email(email);
    expect(sut.getValue()).toBe(email);
  }
);

it.each([
  "",
  "johndoe",
  "johndoe@",
  "johndoe@example",
  "johndoe@.com",
  "@example.com",
])("should test whether the e-mail is invalid", (email: any) => {
  expect(async () => new Email(email)).rejects.toThrow(
    new Error("Invalid email")
  );
});
