import { IncomingMessage, ServerResponse } from "http";
import { IController } from "./interface";
import { IUseCase } from "../../domains/repository/index";

export default class Controller implements IController {
  private req: IncomingMessage;
  private res: ServerResponse;
  private usecase: IUseCase;
  private body: any;

  constructor(req:IncomingMessage, res: ServerResponse, usecase: IUseCase) {
    this.usecase = usecase;
    this.req = req;
    this.res = res;
  }

  public getReq(): IncomingMessage {
    return this.req;
  }

  public getRes(): ServerResponse {
    return this.res;
  }

  private response(statusCode: number, data: any, contentType: string = 'application/json') {
    this.res.writeHead(statusCode, { 'Content-Type': contentType });
    this.res.end(JSON.stringify(data));
  }

  public async upload(): Promise<void> {
    try {
      await this.parseJSON();
    } catch (error) {
      this.response(500, {
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'error to parse JSON',
      });
      return;
    }

    const error = await this.usecase.handleUpload(this.body);
    if ('error_code' in error) {
      this.response(error.code, {
        "error_code": error.error_code,
        "error_description": error.message,
      });
      return;
    }
    
    if ('image_url' in error)
    this.response(error.code, {
      image_url: error.image_url,
      measure_value: error.measure_value,
      measure_uuid: error.measure_uuid,
    });
  }
  
  public async confirm(): Promise<void> {
    try {
      await this.parseJSON();
    } catch (error) {
      this.response(500, {
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'error to parse JSON',
      });
      return;
    }

    try {
      const error = await this.usecase.confirm(this.body);
      if (error) {
        this.response(error.code, {
          "error_code": error.error_code,
          "error_description": error.message,
        });
        return;
      }
    } catch (error) {
      this.response(500, {
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'error to confirm',
      });
      return;
    }

    this.response(200, { success: true });
  }

  public async handleList(customerCode: string, searchParams: any): Promise<void> {

    const mensureType = searchParams.get('measure_type');

    const measureOrError = await this.usecase.handleList(customerCode, mensureType);
    if (measureOrError && 'error_code' in measureOrError) {
      console.log('measureOrError:', measureOrError);
      this.response(measureOrError.code, {
        "error_code": measureOrError.error_code,
        "error_description": measureOrError.message,
      });
      return;
    }

    const measures = measureOrError

    if (!(measures as any).length) {
      this.response(404, {
        "error_code": "MEASURES_NOT_FOUND",
        "error_description": "Nenhuma leitura encontrada",
      });
      return
    }

    const response ={
      customer_code: customerCode,
      measures
    }

    this.response(200, response);
  }

  notFound(): void {
    this.response(404, { message: 'Not Found' });
  }

  private async parseJSON(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';

      this.req.on('data', (chunk) => {
          body += chunk.toString();
          // console.log('body:', body);
      });

      this.req.on('end', () => {
          try {
              const jsonData = JSON.parse(body);
              this.body = jsonData
              resolve(true);
            } catch (error) {
              console.error('Erro ao analisar JSON:', error);
              reject(error);
          }
      });
    });
  }
}