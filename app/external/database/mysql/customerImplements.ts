import { ICustomerRepository } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class CustomerMySQL extends MysqlConnection implements ICustomerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async listMeasure(customerId: string, mensureType: string): Promise<any> {

    console.log('customerId', customerId);
    console.log('mensureType', mensureType);

    const [result] = await this.connection.query(
      `SELECT 
        measure_uuid,
        measure_datetime,
        measure_type,
        has_confirmed,
        image_url
      FROM measures WHERE customer_id = ? AND measure_type = ?`,
      [customerId, mensureType]);

    return result;
  }
}