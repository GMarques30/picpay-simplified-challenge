import { User } from "../../domain/entity/User";

export interface UserRepository {
  saveUser(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDocument(document: string): Promise<User | undefined>;
  getUserByUserId(userId: string): Promise<User | undefined>;
}
