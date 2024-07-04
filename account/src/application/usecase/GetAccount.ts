import { AccountRepository } from "../repository/AccountRepository";

export class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ accountId }: Input): Promise<Output> {
    const account = await this.accountRepository.getByAccountId(accountId);
    if (!account) throw new Error("Account not found");
    return {
      accountId: account.accountId,
      name: account.getName(),
      document: account.getDocument(),
      email: account.getEmail(),
      password: account.getPassword(),
    };
  }
}

type Input = {
  accountId: string;
};

type Output = {
  accountId: string;
  name: string;
  document: string;
  email: string;
  password: string;
};
