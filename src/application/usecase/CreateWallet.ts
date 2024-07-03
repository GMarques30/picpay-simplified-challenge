import { Wallet } from "../../domain/entity/Wallet";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class CreateWallet {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly userRepository: UserRepository
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    await this.userRepository.getByUserId(userId);
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
