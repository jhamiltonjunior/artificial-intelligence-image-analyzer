import { ICustomerRepository } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class CustomerMySQL extends MysqlConnection implements ICustomerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async listMeasure(customerId: string, mensureType: string): Promise<any> {
    let measureQuery = '';
    const values = [customerId];

    if (mensureType) {
      values.push(mensureType);
      measureQuery = `AND measure_type = ?`;
    }

    const [result] = await this.connection.query(
      `SELECT 
        measure_uuid,
        measure_datetime,
        measure_type,
        (
          CASE
            WHEN has_confirmed = 1 THEN 'true'
            ELSE 'false'
          END
        ) as has_confirmed,
        image_url
      FROM measures WHERE customer_id = ? ${measureQuery}`,
      values);

    return result;
  }
}