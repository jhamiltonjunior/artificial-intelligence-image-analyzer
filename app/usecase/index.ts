import { IUseCase, response } from "./interface";
import { validate as uuidValidate } from 'uuid';
import isBase64 from 'is-base64';
import { parse } from "file-type-mime";
import fs from 'fs';

export default class Usecase implements IUseCase {
    constructor() {
        // this.init();
    }

    public async confirm(): Promise<void> {
      console.log(`confirm is work`);
    }
  
    public async handleList(customerCode: string): Promise<void> {
      console.log(`List of ${customerCode}`);
    }

    public async handleUpload(data: any): Promise<response | undefined> {
      const error = this.validateToUpload(data);
      if (error) {
        return error;
      }

      const imageOrError = await this.saveImage(data.image);
      if (typeof imageOrError !== 'string') {
        return imageOrError;
      }

      // Talvez isso nao seja o suficiente
      setTimeout(async () => {
        await this.deleteImage(imageOrError);
      }, 10000);

      return undefined;
    }

    private async deleteImage(filePath: string): Promise<response | undefined> {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error to delete image:', err);
          return {
            code: 500,
            error_code: 'INTERNAL_SERVER_ERROR',
            message: `Error to delete image`,
          };
        }
      });

      return undefined;
    }

    private async saveImage(image: string): Promise<response | string> {
      const mimeType = await this.detectImageType(image);
      if (!mimeType.mime) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The image is invalid`,
        };
      }

      const filePath = `./uploads/${Date.now()}.${mimeType.ext}`;
      const dirPath = './uploads';

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFile(filePath, image, 'base64', (err) => {
        if (err) {
          console.error('Error to save image:', err);
          return {
            code: 500,
            error_code: 'INTERNAL_SERVER_ERROR',
            message: `Error to save image`,
          };
        }
      })

      return filePath;
    }

    private async detectImageType(image: string): Promise<any> {
      const buffer = Buffer.from(image, 'base64');
      const result = parse(buffer);

      return result;
    }

    private isDateValid(date: string): boolean {
      return !isNaN(Date.parse(date));
    }

    private validateToUpload(data: any): response | undefined {
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
    }
}