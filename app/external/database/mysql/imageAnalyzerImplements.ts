import { IHandleImageAnalyzerRepository, response } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class ImageAnalyzer extends MysqlConnection implements IHandleImageAnalyzerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async saveDataGenerateForIA(data: any): Promise<response | undefined> {
    console.log(`handleUpload is work`);
    return undefined;
  }

  public async confirm(id: string, value: number): Promise<void> {
    await this.connection.query('UPDATE measures SET has_confirmed = 1, confirmed_value = ? WHERE measure_uuid = ?', [value, id]);
  }

  public async checkIfMeasureExists(id: string): Promise<any> {
    return await this.connection.query('SELECT has_confirmed FROM measures WHERE measure_uuid = ?', [id]);
  }
}