import { IHandleImageAnalyzerRepository, response } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class ImageAnalyzer extends MysqlConnection implements IHandleImageAnalyzerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async saveMeasure(data: any): Promise<void> {
    await this.connection.query(`
        INSERT INTO measures (measure_uuid, measure_type, measure_value, measure_datetime, image_url, customer_id)
        VALUES (?, ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'), ?, ?)`,
       [data.measure_uuid, data.measure_type, data.measure_value, data.measure_datetime, data.image_url, data.customer_id]);
  }

  public async listMeasure(customerId: string): Promise<response | undefined> {
    return undefined;
  }

  public async saveDataGenerateForIA(data: any): Promise<response | undefined> {
    console.log(`handleUpload is work`);
    return undefined;
  }

  public async confirm(id: string, value: number): Promise<void> {
    await this.connection.query('UPDATE measures SET has_confirmed = 1, measure_value = ? WHERE measure_uuid = ?', [value, id]);
  }

  public async checkIfMeasureExists(id: string): Promise<any> {
    return await this.connection.query('SELECT has_confirmed FROM measures WHERE measure_uuid = ?', [id]);
  }
}