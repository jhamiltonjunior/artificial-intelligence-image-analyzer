export type response = {
  code: number;
  error_code?: string;
  message: string;
}
export interface IUseCase {
  handleUpload(data: any): Promise<response | undefined>;
  confirm(data: any): Promise<response | undefined>;
  handleList(customerCode: string): Promise<void>;
}

export interface IHandleImageAnalyzerRepository {
  confirm(data: any): Promise<response | undefined>;
  saveDataGenerateForIA(data: any): Promise<response | undefined>;
  // confirm(data: any): Promise<response | undefined>;
}

