import { UserRepository } from "../../src/application/repository/UserRepository";
import { User } from "../../src/domain/entity/User";

export class UserRepositoryMemory implements UserRepository {
  users: User[];

  constructor() {
    this.users = [];
  }

  async saveUser(user: any): Promise<void> {
    this.users.push(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.getEmail() === email);
  }

  async getUserByDocument(document: string): Promise<User | undefined> {
    return this.users.find((user) => user.getDocument() === document);
  }
}
