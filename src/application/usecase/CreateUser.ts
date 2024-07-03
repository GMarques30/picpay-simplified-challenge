import { UserFactory } from "../../domain/entity/User";
import { UserRepository } from "../repository/UserRepository";

export class CreateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute({ name, document, email, password }: Input): Promise<Output> {
    const emailAlreadyRegistred = await this.userRepository.getByEmail(email);
    if (emailAlreadyRegistred)
      throw new Error("The provided Email is already registered in our system");
    const documentAlreadyRegistred = await this.userRepository.getByDocument(
      document
    );
    if (documentAlreadyRegistred)
      throw new Error(
        "The provided CPF/CNPJ is already registered in our system"
      );
    const user = UserFactory.createUser(name, document, email, password);
    await this.userRepository.save(user);
    return {
      userId: user.userId,
    };
  }
}

type Input = {
  name: string;
  document: string;
  email: string;
  password: string;
};

type Output = {
  userId: string;
};
