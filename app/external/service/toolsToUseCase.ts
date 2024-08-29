import { parse } from 'file-type-mime';
import { IToolsUseCase } from "../../usecase/interface";
import { validate as uuidValidate, v4 as uuid } from 'uuid';
import isBase64 from 'is-base64';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { response } from '../../domains/repository';

export default class ToolsUseCase implements IToolsUseCase{
    constructor() {}

    public generateUUID(): string {
        return uuid();
    }

    public async generativeIA(imageBase64: string, mimeType: string): Promise<response | string> {
        if (!process.env.GEMINI_API_KEY) {
            return {
                code: 500,
                error_code: 'INTERNAL_SERVER_ERROR',
                message: `The GEMINI_API_KEY is not defined`,
            };
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "analyze this image, this a measure, who the value that I paid, please return only value who I should paid and should a integer number, case you can't find the value return ++++++";
        const image = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };

        try {
            const result = await model.generateContent([prompt, image]);
            return result.response.text();
        } catch (err) {
            console.log('Error to generate IA final return:', err);
            return {
                code: 500,
                error_code: 'INTERNAL_SERVER_ERROR',
                message: `Error to generate IA`,
            };
        }
    }

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