import { Wallet } from "../../domain/entity/Wallet";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class CreateWallet {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly userRepository: UserRepository
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const userExists = await this.userRepository.getByUserId(userId);
    if (!userExists) throw new Error("User does not exists");
    const wallet = Wallet.create(userId);
    await this.walletRepository.save(wallet);
    return {
      walletId: wallet.walletId,
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  walletId: string;
};
