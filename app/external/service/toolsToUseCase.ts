import { parse } from "file-type-mime";
import { IToolsUseCase } from "../../usecase/interface";
import { validate as uuidValidate } from 'uuid';
import isBase64 from 'is-base64';

export default class ToolsUseCase implements IToolsUseCase{
    constructor() {}

    public async detectImageType(image: string): Promise<any> {
        const buffer = Buffer.from(image, 'base64');
        const result = parse(buffer);
  
        return result;
    }

    public checkIfIsBase64(image: string, ...args: any): boolean {
        return isBase64(image, { paddingRequired: true });
    }

    public uuidValidate(uuid: string): boolean {
        return uuidValidate(uuid);
    }
}