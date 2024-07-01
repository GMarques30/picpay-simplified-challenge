import { UserFactory } from "../../domain/entity/User";
import { UserRepository } from "../repository/UserRepository";

export class CreateUser {
  constructor(readonly userRepository: UserRepository) {}

  async execute({
    name,
    document,
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const emailAlreadyRegistred = await this.userRepository.getUserByEmail(
      email
    );
    if (emailAlreadyRegistred)
      throw new Error("The provided Email is already registered in our system");
    const documentAlreadyRegistred =
      await this.userRepository.getUserByDocument(document);
    if (documentAlreadyRegistred)
      throw new Error(
        "The provided CPF/CNPJ is already registered in our system"
      );
    const user = UserFactory.createUser(name, document, email, password);
    await this.userRepository.saveUser(user);
    return {
      userId: user.userId,
    };
  }
}

type CreateUserInput = {
  name: string;
  document: string;
  email: string;
  password: string;
};

type CreateUserOutput = {
  userId: string;
};
