var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parse } from 'file-type-mime';
import { validate as uuidValidate, v4 as uuid } from 'uuid';
import isBase64 from 'is-base64';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cron from 'node-cron';
import fs from 'fs';
export default class ToolsUseCase {
    constructor() {
        this.scheduleToDeleteAllImagesInFolderWhenServerIsStarted();
    }
    scheduleToDeleteAllImagesInFolderWhenServerIsStarted(folderPath) {
        if (!folderPath)
            folderPath = 'uploads';
        const ONE_HOUR = 3600000;
        cron.schedule('*/1 * * * *', () => {
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.log('Error to read folder:', err);
                    return;
                }
                files.forEach((file) => {
                    const filePath = `${folderPath}/${file}`;
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            console.log('err:', err);
                            return;
                        }
                        if (stats.birthtimeMs < Date.now() - ONE_HOUR) {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.log('err:', err);
                                    return;
                                }
                            });
                        }
                    });
                });
            });
        });
    }
    generateUUID() {
        return uuid();
    }
    generativeIA(imageBase64, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield model.generateContent([prompt, image]);
                return result.response.text();
            }
            catch (err) {
                console.log('Error to generate IA final return:', err);
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to generate IA`,
                };
            }
        });
    }
    detectImageType(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = Buffer.from(image, 'base64');
            const result = parse(buffer);
            return result;
        });
    }
    checkIfIsBase64(image, ...args) {
        return isBase64(image, { paddingRequired: true });
    }
    uuidValidate(uuid) {
        return uuidValidate(uuid);
    }
    scheduleToDeleteImage(filePath, time) {
        cron.schedule('*/1 * * * *', () => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log('err:', err);
                    return;
                }
                if (stats.birthtimeMs < Date.now() - time) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log('err:', err);
                            return;
                        }
                    });
                }
            });
        });
    }
}
