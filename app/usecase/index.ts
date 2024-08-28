import { IUseCase } from "./interface";

export default class Usecase implements IUseCase {
    constructor() {
        // this.init();
    }

    public async handleUpload(data: any): Promise<void> {
      console.log(`upload is work`);
    }

    private async checkIfImageIsBase64(data: any): Promise<boolean> {
      return true;
    }

  
    public async confirm(): Promise<void> {
      console.log(`confirm is work`);
    }
  
    public async handleList(customerCode: string): Promise<void> {
      console.log(`List of ${customerCode}`);
    }
}