import { ICustomerRepository, IHandleImageAnalyzerRepository, IUseCase, response } from "../domains/repository/index";
import fs from 'fs/promises';
import { IToolsUseCase } from "../external/service/interface";

export default class Usecase implements IUseCase {
    private tools: IToolsUseCase
    private handleImageAnalyzerRepository: IHandleImageAnalyzerRepository
    private handleCustomerRepository: ICustomerRepository
  
    constructor(tools: IToolsUseCase, handleImageAnalyzerRepository: IHandleImageAnalyzerRepository, handleCustomerRepository: ICustomerRepository) {
      this.tools = tools;
      this.handleImageAnalyzerRepository = handleImageAnalyzerRepository;
      this.handleCustomerRepository = handleCustomerRepository;
    }

    public async confirm(data: any): Promise<response | undefined> {
      if (!data.measure_uuid || !this.tools.uuidValidate(data.measure_uuid))
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The measure_uuid is invalid`,
        };

      if (
        data.confirmed_value === "" ||
        typeof data.confirmed_value !== "number" ||
        isNaN(data.confirmed_value) ||
        data.confirmed_value < 0 ||
        !Number.isInteger(data.confirmed_value)
      )
        return {
          code: 400,
          error_code: 'INVALID_DATA',
          message: `The confirmed_value is invalid`,
        };

      const measureExists = await this.handleImageAnalyzerRepository.checkIfMeasureExists(data.measure_uuid);

      if (!measureExists[0][0])
        return {
          code: 404,
          error_code: 'MEASURE_NOT_FOUND',
          message: `The measure does not exist`,
        };

      if (measureExists[0][0].has_confirmed === 1) {
        return {
          code: 409,
          error_code: 'CONFIRMATION_DUPLICATE',
          message: `Leitura do mês já realizada`,
        };
      }

      try {
        await this.handleImageAnalyzerRepository.confirm(data.measure_uuid, data.confirmed_value);
      } catch (err) {
        console.error('Error to confirm:', err);
        return {
          code: 500,
          error_code: 'INTERNAL_SERVER_ERROR',
          message: `Error to confirm`,
        };
      }

      return undefined;
    }
  
    public async handleList(customerCode: string, mensureType: string): Promise<response | undefined> {
      mensureType = mensureType.toLocaleUpperCase();

      if (mensureType !== 'WATER' && mensureType !== 'GAS') 
        return {
          code: 400,
          error_code: 'INVALID_TYPE',
          message: `Tipo de medição não permitida`,
        };
        
      try {
        return await this.handleCustomerRepository.listMeasure(customerCode, mensureType);
      } catch (err) {
        console.error('Error to list measure:', err);
        return {
          code: 500,
          error_code: 'INTERNAL_SERVER_ERROR',
          message: `Error to list measure`,
        };
      }
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