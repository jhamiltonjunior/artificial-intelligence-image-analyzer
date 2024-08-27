import { IncomingMessage, ServerResponse } from "http";

export default class Controller {
  protected req: IncomingMessage;
  protected res: ServerResponse;

  constructor(req:IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  private response(statusCode: number, data: any, contentType: string = 'application/json') {
    this.res.writeHead(statusCode, { 'Content-Type': contentType });
    this.res.end(JSON.stringify(data));
  }

  protected async upload(): Promise<void> {
    this.response(200, { message: `upload is work` });
  }

  protected async confirm(): Promise<void> {
    this.response(200, { message: `confirm is work` });
  }

  protected async handleList(customerCode: string): Promise<void> {
    this.response(200, { message: `List of ${customerCode}` });
  }

  protected notFound(): void {
    this.response(404, { message: 'Not Found' });
  }
}