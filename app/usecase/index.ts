import { IUseCase, response } from "../domains/repository/index";
import fs from 'fs/promises';
import { IToolsUseCase } from "../external/service/interface";

export default class Usecase implements IUseCase {
    private tools: IToolsUseCase
  
    constructor(tools: IToolsUseCase) {
      this.tools = tools;
    }

    public async confirm(data: any): Promise<response | undefined> {
      console.log(`confirm is work`);
      if (!data.customer_code || !this.tools.uuidValidate(data.customer_code))
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The customer_code is invalid`,
        };

      if (!data.confirmed_value || isNaN(data.confirmed_value) || data.confirmed_value < 0)
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The confirmed_value is invalid`,
        };

      return undefined;
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
      if (typeof imageOrError !== 'string')
        return imageOrError;

      // Talvez isso nao seja o suficiente
      setTimeout(async () => {
        this.deleteImage(imageOrError);
      }, 60000);

      return undefined;
    }

    private async deleteImage(filePath: string): Promise<response | undefined> {
      try{
        fs.unlink(filePath)
      } catch (err) {
        // salvar os dados em um arquivo de log
        console.error('Error to delete image:', err);
          // return {
          //   code: 500,
          //   error_code: 'INTERNAL_SERVER_ERROR',
          //   message: `Error to delete image`,
          // };
      }

      return undefined;
    }

    private async saveImage(image: string): Promise<response | string> {
      const mimeType = await this.detectImageType(image);
      if (!mimeType?.mime) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The image is invalid`,
        };
      }

      const filePath = `./uploads/${Date.now()}.${mimeType.ext}`;
      const dirPath = './uploads';

      try {
        if (!await this.checkIfDirExists(dirPath)) {
          fs.mkdir(dirPath, { recursive: true });
        }
        fs.writeFile(filePath, image, 'base64')
      } catch (err) {
        console.error('Error to save image:', err);
        return {
          code: 500,
          error_code: 'INTERNAL_SERVER_ERROR',
          message: `Error to save image`,
        };
      }

      return filePath;
    }

    private async checkIfDirExists(dir: string): Promise<boolean> {
      return await fs.access(dir, fs.constants.F_OK)
               .then(() => true)
               .catch(() => false)
    }

    private async detectImageType(image: string): Promise<any> {
      return await this.tools.detectImageType(image);
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

      if (!this.tools.uuidValidate(data.customer_code)) {
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

      if (!data.image && !this.tools.checkIfIsBase64(data.image, { paddingRequired: true })) {
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The image is invalid`,
        };
      }
    }
}