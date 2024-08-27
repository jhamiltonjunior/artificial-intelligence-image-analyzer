export interface IUseCase {
  upload(): Promise<void>;
  confirm(): Promise<void>;
  handleList(customerCode: string): Promise<void>;
}