export default class Usecase {
    constructor() {
        // this.init();
    }

    protected async upload(): Promise<void> {
        console.log(`upload is work`);
    }
  
    protected async confirm(): Promise<void> {
        console.log(`confirm is work`);
    }
  
    protected async handleList(customerCode: string): Promise<void> {
        console.log(`List of ${customerCode}`);
    }
  
    protected notFound(): void {
        console.log(`Not Found`);
    }
}