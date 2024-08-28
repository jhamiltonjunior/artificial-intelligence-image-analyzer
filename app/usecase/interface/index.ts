export type response = {
  code: number;
  error_code?: string;
  message: string;
}
export interface IUseCase {
  handleUpload(data: any): Promise<response | undefined>;
  confirm(): Promise<void>;
  handleList(customerCode: string): Promise<void>;
}