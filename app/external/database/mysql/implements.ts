import mysql from 'mysql2/promise';
import { IHandleImageAnalyzerRepository, response } from "../../../domains/repository";

type credentials = {
  host: string;
  port: number;
  user: string;
  password: string;
}

export default class MysqlImplements implements IHandleImageAnalyzerRepository {
  credentials: credentials
  connection: mysql.Connection;

  constructor(credentials: credentials) {
    this.credentials = credentials;

    this.connect();
  }

  public async init(): Promise<void> {
    console.log(`init is work`);
    return undefined;
  }

  private async connect(): Promise<any> {
    console.log(`connect is work`);
    this.connection = await mysql.createConnection(this.credentials);

    return undefined;
  }

  public async saveDataGenerateForIA(data: any): Promise<response | undefined> {
    console.log(`handleUpload is work`);
    return undefined;
  }

  public async confirm(data: any): Promise<response | undefined> {
    console.log(`confirm is work`);

    this.connection.query('SELECT * FROM table WHERE id = ?', [data.id]);

    return undefined;
  }
}