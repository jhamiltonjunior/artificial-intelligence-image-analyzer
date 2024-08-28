import { ICustomerRepository } from "../../../domains/repository";
import MysqlConnection, {Credentials} from "./implements";

export class CustomerMySQL extends MysqlConnection implements ICustomerRepository {
  constructor(credentials: Credentials) {
    super(credentials);
  }

  public async listMeasure(customerId: string): Promise<any> {
    return await this.connection.query(
      `SELECT * FROM measures WHERE customer_id = ?`,
      [customerId]);
  }
}