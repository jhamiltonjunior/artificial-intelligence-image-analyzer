export type response = {
  code: number;
  error_code?: string;
  message: string;
}

export type responseRegister = {
  code: number;
  image_url: string;
  measure_value: number;
  measure_uuid: string;
}

export interface IUseCase {
  handleUpload(data: any): Promise<response | responseRegister>;
  confirm(data: any): Promise<response | undefined>;
  handleList(customerCode: string, mensureType: string): Promise<response | undefined>;
}

export interface IHandleImageAnalyzerRepository {
  confirm(id: string, value: number): Promise<void>;
  saveDataGenerateForIA(data: any): Promise<response | undefined>;
  checkIfMeasureExists(id: string): Promise<any>;
  listMeasure(customerId: string): Promise<response | undefined>;
  saveMeasure(data: any): Promise<void>;
}

export interface ICustomerRepository {
  listMeasure(customerId: string, mensureType: string): Promise<response | undefined>;
}
