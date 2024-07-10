import { Password } from "./Password";

test.each(["A1b@567", "Abc@123", "1A@bcdef"])(
  "Deve ser possivel criar uma senha",
  (password: string) => {
    const sut = Password.create(password);
    expect(sut).toBeInstanceOf(Password);
    expect(sut.passwordMatches(password)).toBeTruthy();
  }
);

test.each(["abc123", "ABC@123", "Abcdefg"])(
  "Deve ser possivel criar uma senha",
  (password: string) => {
    expect(async () => Password.create(password)).rejects.toThrow(
      new Error("Invalid password")
    );
  }
);
