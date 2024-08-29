import { parse } from 'file-type-mime';
import { IToolsUseCase } from "../../usecase/interface";
import { validate as uuidValidate } from 'uuid';
import isBase64 from 'is-base64';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { response } from '../../domains/repository';

export default class ToolsUseCase implements IToolsUseCase{
    constructor() {}

    public async generativeIA(imageBase64: string, mimeType: string): Promise<response | string> {
        console.log(process.env.GEMINI_API_KEY);
        if (!process.env.GEMINI_API_KEY) {
            return {
                code: 500,
                error_code: 'INTERNAL_SERVER_ERROR',
                message: `The GEMINI_API_KEY is not defined`,
            };
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "analyze this image, this a measure, who the value that I paid, please return only value who I should paid?";
        const image = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, image]);
        console.log(result.response.text());

        return result.response.text();
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