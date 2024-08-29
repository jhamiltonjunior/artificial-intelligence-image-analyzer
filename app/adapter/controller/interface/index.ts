// Interface para definir o contrato de Controller
export interface IController {
  upload(): Promise<void>;
  confirm(): Promise<void>;
  handleList(customerCode: string, searchParams: any): Promise<void>;
  notFound(): void;
  getReq(): any;
  getRes(): any;
  serveStaticFiles(url: string): Promise<void>;
}