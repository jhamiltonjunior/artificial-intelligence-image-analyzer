import mysql from 'mysql2/promise';
import { IHandleImageAnalyzerRepository } from "../../../domains/repository";

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
    this.connection.query('CREATE DATABASE IF NOT EXISTS image_analyzer');
    return undefined;
  }

  public async confirm(data: any): Promise<any> {
    console.log(`confirm is work`);
    return undefined;
  }
}