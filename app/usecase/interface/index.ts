export interface IToolsUseCase {
    checkIfIsBase64(image: string, ...args: any): boolean
    uuidValidate(uuid: string): boolean
    detectImageType(image: string): Promise<any>
}