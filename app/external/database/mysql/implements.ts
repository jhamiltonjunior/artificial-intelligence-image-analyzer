import mysql from 'mysql2/promise';

export type Credentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string,
}

export default class MysqlConnection {
  protected connection: mysql.Connection;

  constructor(credentials: Credentials) {
    this.connect(credentials);
  }

  private async connect(credentials: Credentials): Promise<void> {
    this.connection = await mysql.createConnection(credentials);
  }
}