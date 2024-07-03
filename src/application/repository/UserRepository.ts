import { User } from "../../domain/entity/User";

export interface UserRepository {
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<User | undefined>;
  getByDocument(document: string): Promise<User | undefined>;
  getByUserId(userId: string): Promise<User>;
  checkIfUserIsCustomer(userId: string): Promise<boolean>;
}
