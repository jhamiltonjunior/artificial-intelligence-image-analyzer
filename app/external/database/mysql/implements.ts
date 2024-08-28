import mysql from 'mysql2/promise';
import { IHandleImageAnalyzerRepository, response } from "../../../domains/repository";

type credentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string,
}

export default class MysqlImplements implements IHandleImageAnalyzerRepository {
  credentials: credentials
  connection: mysql.Connection;

  constructor(credentials: credentials) {
    this.credentials = credentials;

    this.connect();
  }

  private async connect(): Promise<void> {
    this.connection = await mysql.createConnection(this.credentials);
  }

  public async saveDataGenerateForIA(data: any): Promise<response | undefined> {
    console.log(`handleUpload is work`);
    return undefined;
  }

  public async confirm(id: string, value: number): Promise<void> {
    await this.connection.query('UPDATE measure SET confirmed = 1, value = ? WHERE measure.code = ?', [value, id]);
  }

  public async checkIfMeasureExists(id: string): Promise<any> {
    return await this.connection.query('SELECT confirmed FROM measure WHERE code = ?', [id]) as any;
  }
}