import { AccountFactory } from "../../domain/entity/Account";
import { AccountRepository } from "../repository/AccountRepository";

export class CreateAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ name, document, email, password }: Input): Promise<Output> {
    const emailAlreadyRegistred = await this.accountRepository.getByEmail(
      email
    );
    if (emailAlreadyRegistred)
      throw new Error("The provided Email is already registered in our system");
    const documentAlreadyRegistred = await this.accountRepository.getByDocument(
      document
    );
    if (documentAlreadyRegistred)
      throw new Error(
        "The provided CPF/CNPJ is already registered in our system"
      );
    const account = AccountFactory.createAccount(
      name,
      document,
      email,
      password
    );
    await this.accountRepository.save(account);
    return {
      accountId: account.accountId,
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
  accountId: string;
};
