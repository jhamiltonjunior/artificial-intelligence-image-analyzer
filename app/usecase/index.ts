import { IUseCase } from "../external/routes/interface";

export default class Usecase implements IUseCase {
    constructor() {
        // this.init();
    }

    public async upload(): Promise<void> {
        console.log(`upload is work`);
    }
  
    public async confirm(): Promise<void> {
        console.log(`confirm is work`);
    }
  
    public async handleList(customerCode: string): Promise<void> {
        console.log(`List of ${customerCode}`);
    }
}