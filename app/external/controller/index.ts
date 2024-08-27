import { IncomingMessage, ServerResponse } from "http";
import { IController } from "./interface";

export default class Controller implements IController {
  private req: IncomingMessage;
  private res: ServerResponse;

  constructor(req:IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
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