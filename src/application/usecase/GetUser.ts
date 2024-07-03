import { UserRepository } from "../repository/UserRepository";

export class GetUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute({ userId }: Input): Promise<Output> {
    const user = await this.userRepository.getByUserId(userId);
    if (!user) throw new Error("User does not exists");
    return {
      userId: user.userId,
      name: user.getName(),
      document: user.getDocument(),
      email: user.getEmail(),
      password: user.getPassword(),
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  userId: string;
  name: string;
  document: string;
  email: string;
  password: string;
};
