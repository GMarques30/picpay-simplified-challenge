import { AxiosAdapter, HttpClient } from "./../../infra/http/HttpClient";
import { WalletRepositoryMemory } from "../../../test/repository/WalletRepositoryMemory";
import { AccountGatewayHttp } from "../../infra/gateway/AccountGatewayHttp";
import { AccountGateway } from "../gateway/AccountGateway";
import { WalletRepository } from "../repository/WalletRepository";
import { CreateWallet } from "./CreateWallet";
import { GetWallet } from "./GetWallet";

let walletRepository: WalletRepository;
let getWallet: GetWallet;
let sut: CreateWallet;

beforeEach(() => {
  walletRepository = new WalletRepositoryMemory();
  getWallet = new GetWallet(walletRepository);
  sut = new CreateWallet(walletRepository);
});

test("Deve ser possivel criar uma carteira", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  const outputCreateWallet = await sut.execute(inputCreateWallet);
  expect(outputCreateWallet.walletId).toBeDefined();
  const inputGetWallet = {
    accountId: inputCreateWallet.accountId,
  };
  const outputGetWallet = await getWallet.execute(inputGetWallet);
  expect(outputGetWallet.walletId).toBe(outputCreateWallet.walletId);
  expect(outputGetWallet.accountId).toBe(inputCreateWallet.accountId);
  expect(outputGetWallet.balance).toBe(0);
});

test("Não deve ser possivel criar uma carteira que já existe", async () => {
  const inputCreateWallet = {
    accountId: crypto.randomUUID(),
  };
  await sut.execute(inputCreateWallet);
  expect(async () => await sut.execute(inputCreateWallet)).rejects.toThrow(
    new Error("Wallet already exists")
  );
});
