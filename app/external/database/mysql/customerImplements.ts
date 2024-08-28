import { IHandleImageAnalyzerRepository, response } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class CustomerMySQL extends MysqlConnection implements IHandleImageAnalyzerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async saveDataGenerateForIA(data: any): Promise<response | undefined> {
    console.log(`handleUpload is work`);
    return undefined;
  }

  public async confirm(id: string, value: number): Promise<void> {
    await this.connection.query('UPDATE measure SET confirmed = 1, value = ? WHERE code = ?', [value, id]);
  }

  public async checkIfMeasureExists(id: string): Promise<any> {
    return await this.connection.query('SELECT confirmed FROM measure WHERE code = ?', [id]);
  }
}