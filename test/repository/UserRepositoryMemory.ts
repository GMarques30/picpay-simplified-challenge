import { UserRepository } from "../../src/application/repository/UserRepository";
import { User } from "../../src/domain/entity/User";

export class UserRepositoryMemory implements UserRepository {
  users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.getEmail() === email);
  }

  async getByDocument(document: string): Promise<User | undefined> {
    return this.users.find((user) => user.getDocument() === document);
  }

  async getByUserId(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }

  async checkIfUserIsCustomer(userId: string): Promise<boolean> {
    const user = this.users.find((user) => user.userId === userId);
    if (!user) throw new Error("User not found");
    return user.getDocument().length === 11 ? true : false;
  }
}
