import { IncomingMessage, ServerResponse } from "http";
import { IController } from "./interface";
import { IUseCase } from "../../usecase/interface";
import formidable, {errors as formidableErrors} from 'formidable';

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
      console.error('Erro ao analisar JSON:', error);

      this.response(500, {
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Houve um erro interno no servidor',
      });

      return;
    }
    
    console.log('Body:', this.body);

    const error = await this.usecase.handleUpload(this.body);
    if (error) {
      this.response(error.code, {
        "error_code": "INVALID_DATA",
        "error_description": error.message,
      });
      return;
    }
    
    this.response(200, {
      message: 'upload is work',
    });
  }
  
  public async confirm(): Promise<void> {
    this.response(200, { message: `confirm is work` });
  }

  public async handleList(customerCode: string): Promise<void> {
    this.response(200, { message: `List of ${customerCode}` });
  }

  notFound(): void {
    this.response(404, { message: 'Not Found' });
  }

  private async parseJSON(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';

      this.req.on('data', (chunk) => {
          body += chunk.toString();
          console.log('body:', body);
      });

      this.req.on('end', () => {
          try {
              const jsonData = JSON.parse(body);
              this.body = jsonData
              resolve(true);
            } catch (error) {
              console.error('Erro ao analisar JSON:', error);
              this.response(500, {
                error_code: 'INTERNAL_SERVER_ERROR',
                message: 'Houve um erro interno no servidor',
              });
              reject(error);
          }
      });
    });
  }
}