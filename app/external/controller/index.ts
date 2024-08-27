import { IncomingMessage, ServerResponse } from "http";
import { IController } from "./interface";
import { IUseCase } from "../routes/interface";

export default class Controller implements IController {
  private req: IncomingMessage;
  private res: ServerResponse;
  private usecase: IUseCase;

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
    this.response(200, { message: `upload is work` });
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
}