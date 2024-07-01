import { Wallet } from "../../domain/entity/Wallet";
import { UserRepository } from "../repository/UserRepository";
import { WalletRepository } from "../repository/WalletRepository";

export class CreateWallet {
  constructor(
    readonly walletRepository: WalletRepository,
    readonly userRepository: UserRepository
  ) {}

  async execute({ userId }: CreateWalletInput): Promise<CreateWalletOutput> {
    const userExists = await this.userRepository.getUserByUserId(userId);
    if (!userExists) throw new Error("User does not exists");
    const wallet = Wallet.create(userId);
    await this.walletRepository.saveWallet(wallet);
    return {
      walletId: wallet.walletId,
    };
  }
}

type CreateWalletInput = {
  userId: string;
};

type CreateWalletOutput = {
  walletId: string;
};
