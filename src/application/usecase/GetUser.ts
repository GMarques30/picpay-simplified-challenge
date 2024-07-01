import { UserRepository } from "../repository/UserRepository";

export class GetUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.getUserByUserId(userId);
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

type GetUserInput = {
  userId: string;
};

type GetUserOutput = {
  userId: string;
  name: string;
  document: string;
  email: string;
  password: string;
};
