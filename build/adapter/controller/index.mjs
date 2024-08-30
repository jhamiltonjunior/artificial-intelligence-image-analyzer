var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import fs from 'fs';
import { parse } from 'file-type-mime';
const __dirname = path.resolve();
export class Controller {
    constructor(req, res, usecase) {
        this.usecase = usecase;
        this.req = req;
        this.res = res;
    }
    getReq() {
        return this.req;
    }
    getRes() {
        return this.res;
    }
    response(statusCode, data, contentType = 'application/json') {
        this.res.writeHead(statusCode, { 'Content-Type': contentType });
        this.res.end(JSON.stringify(data));
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.parseJSON();
            }
            catch (error) {
                this.response(500, {
                    error_code: 'INTERNAL_SERVER_ERROR',
                    error_description: 'error to parse JSON',
                });
                return;
            }
            const error = yield this.usecase.handleUpload(this.body);
            if ('error_code' in error) {
                this.response(error.code, {
                    "error_code": error.error_code,
                    "error_description": error.message,
                });
                return;
            }
            if ('image_url' in error)
                this.response(error.code, {
                    image_url: error.image_url,
                    measure_value: error.measure_value,
                    measure_uuid: error.measure_uuid,
                });
        });
    }
    confirm() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.parseJSON();
            }
            catch (error) {
                this.response(500, {
                    error_code: 'INTERNAL_SERVER_ERROR',
                    error_description: 'error to parse JSON',
                });
                return;
            }
            try {
                const error = yield this.usecase.confirm(this.body);
                if (error) {
                    this.response(error.code, {
                        "error_code": error.error_code,
                        "error_description": error.message,
                    });
                    return;
                }
            }
            catch (error) {
                this.response(500, {
                    error_code: 'INTERNAL_SERVER_ERROR',
                    error_description: 'error to confirm',
                });
                return;
            }
            this.response(200, { success: true });
        });
    }
    handleList(customerCode, searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensureType = searchParams.get('measure_type');
            const measureOrError = yield this.usecase.handleList(customerCode, mensureType);
            if (measureOrError && 'error_code' in measureOrError) {
                console.log('measureOrError:', measureOrError);
                this.response(measureOrError.code, {
                    "error_code": measureOrError.error_code,
                    "error_description": measureOrError.message,
                });
                return;
            }
            const measures = measureOrError;
            if (!measures.length) {
                this.response(404, {
                    "error_code": "MEASURES_NOT_FOUND",
                    "error_description": "Nenhuma leitura encontrada",
                });
                return;
            }
            const response = {
                customer_code: customerCode,
                measures
            };
            this.response(200, response);
        });
    }
    serveStaticFiles(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(__dirname, url);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    this.response(404, {
                        "error_code": "IMAGE_NOT_FOUND",
                        "error_description": "Nenhuma imagem encontrada",
                    });
                    return;
                }
                const type = parse(data);
                const mimeType = type ? type.mime : 'application/octet-stream';
                this.res.writeHead(200, { 'Content-Type': mimeType });
                this.res.end(data);
            });
        });
    }
    notFound() {
        this.response(404, { message: 'Not Found' });
    }
    parseJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let body = '';
                this.req.on('data', (chunk) => {
                    body += chunk.toString();
                    // console.log('body:', body);
                });
                this.req.on('end', () => {
                    try {
                        const jsonData = JSON.parse(body);
                        this.body = jsonData;
                        resolve(true);
                    }
                    catch (error) {
                        console.error('Erro ao analisar JSON:', error);
                        reject(error);
                    }
                });
            });
        });
    }
}
