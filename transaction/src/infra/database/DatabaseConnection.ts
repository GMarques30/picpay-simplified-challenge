import pgp from "pg-promise";

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class InMemoryAdapter implements DatabaseConnection {
  async query(statement: string, params: any): Promise<any> {}
  async close(): Promise<void> {}
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL!);
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
