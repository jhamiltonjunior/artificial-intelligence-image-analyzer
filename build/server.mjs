var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from 'node:http';
import { Routes } from './adapter/routes/index.mjs';
import { Controller } from './adapter/controller/index.mjs';
import { Usecase } from './usecase/index.js';
import ToolsUseCase from './external/service/toolsToUseCase.mjs';
import { ImageAnalyzer } from './external/database/mysql/imageAnalyzerImplements.js';
import { CustomerMySQL } from './external/database/mysql/customerImplements.js';
const host = '0.0.0.0';
const port = 3000;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const conn = {
    host: 'artificial-intelligence-image-analyzer-mysqldb-1',
    port: 3306,
    user: 'root',
    password: 'root_password',
    database: 'image_analyzer',
};
const tools = new ToolsUseCase();
const imageHandle = new ImageAnalyzer(conn);
const customer = new CustomerMySQL(conn);
const usecase = new Usecase(tools, imageHandle, customer);
const server = createServer((req, res) => {
    console.log('printando o host', req.headers.host);
    try {
        const controller = new Controller(req, res, usecase);
        new Routes(controller);
    }
    catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: 'internal error',
        }));
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fetch('http://localhost:3000/58e04248-aa27-4d6e-98d7-69bf905e27fc/list?measure_type=');
    const data = yield result.json();
    console.log(data);
    console.log('Server is running');
}))();
server.listen(port, host, () => {
    console.log(`Listenng on ${host}:${port}`);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
