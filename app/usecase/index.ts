import { IUseCase, response } from "./interface";
import { validate as uuidValidate } from 'uuid';
import isBase64 from 'is-base64';

export default class Usecase implements IUseCase {
    constructor() {
        // this.init();
    }

    public async handleUpload(data: any): Promise<response | undefined> {
      console.log(data)
      if (data.measure_type !== 'WATER' && data.measure_type !== 'GAS') 
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The measure_type is invalid`,
        }

      if (!uuidValidate(data.customer_code)) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The customer_code is invalid`,
        };
      }

      if (!this.isDateValid(data.measure_datetime)) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The measure_datetime is invalid`,
        };
      }

      if (!isBase64(data.image, { paddingRequired: true })) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The image is invalid`,
        };
      }

      return undefined;
    }

    private isDateValid(date: string): boolean {
      return !isNaN(Date.parse(date));
    }

    // private v
  
    public async confirm(): Promise<void> {
      console.log(`confirm is work`);
    }
  
    public async handleList(customerCode: string): Promise<void> {
      console.log(`List of ${customerCode}`);
    }
}