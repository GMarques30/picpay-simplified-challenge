import pgp from "pg-promise";

export interface DatabaseConnection {
  query(statement: string, params: any, transaction?: boolean): Promise<any>;
  close(): Promise<void>;
  commit(): Promise<void>;
}

export class InMemoryAdapter implements DatabaseConnection {
  async query(statement: string, params: any): Promise<any> {}
  async close(): Promise<void> {}
  async commit(): Promise<void> {}
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(
      "postgres://postgres:123456@postgres_account:5432/app"
    );
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }

  async commit(): Promise<void> {}
}

export class PgPromiseAdapterUoW implements DatabaseConnection {
  connection: any;
  statements: { statement: string; params: any }[];

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL!);
    this.statements = [];
  }

  async query(
    statement: string,
    params: any,
    transaction: boolean = false
  ): Promise<any> {
    if (!transaction) {
      return this.connection.query(statement, params);
    } else {
      this.statements.push({ statement, params });
    }
  }

  async close(): Promise<void> {
    return this.connection.$pool.end();
  }

  async commit(): Promise<void> {
    await this.connection
      .tx(async (t: any) => {
        const transactions = [];
        for (const statement of this.statements) {
          transactions.push(
            await t.query(statement.statement, statement.params)
          );
        }
        return t.batch(transactions);
      })
      .then((data: any) => {
        console.log("commit");
      })
      .catch((data: any) => {
        console.log("rollback");
      });
  }
}
