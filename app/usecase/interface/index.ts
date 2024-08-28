export interface IUseCase {
  handleUpload(data: any): Promise<void>;
  confirm(): Promise<void>;
  handleList(customerCode: string): Promise<void>;
}