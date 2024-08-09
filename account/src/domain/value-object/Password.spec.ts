import { Password } from "./Password";

it.each(["A1b@567", "Abc@123", "1A@bcdef"])(
  "should be possible to create a password",
  (password: string) => {
    const sut = Password.create(password);
    expect(sut).toBeInstanceOf(Password);
    expect(sut.passwordMatches(password)).toBeTruthy();
  }
);

it.each(["abc123", "ABC@123", "Abcdefg"])(
  "should not be possible to create a password",
  (password: string) => {
    expect(async () => Password.create(password)).rejects.toThrow(
      new Error("Invalid password")
    );
  }
);
