import { IncomingMessage, ServerResponse } from "http";

// Interface para definir o contrato de Controller
export interface IController {
  upload(): Promise<void>;
  confirm(): Promise<void>;
  handleList(customerCode: string): Promise<void>;
  notFound(): void;
}