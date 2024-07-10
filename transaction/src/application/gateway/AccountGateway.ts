export interface AccountGateway {
  createAccount(account: InputCreateAccount): Promise<OutputCreateAccount>;
  getByAccountId(accountId: string): Promise<OutputGetByAccountId>;
}

export type InputCreateAccount = {
  name: string;
  document: string;
  email: string;
  password: string;
};

export type OutputCreateAccount = {
  accountId: string;
};

export type OutputGetByAccountId = {
  accountId: string;
  name: string;
  document: string;
  email: string;
  password: string;
};
