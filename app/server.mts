import { createServer } from 'node:http';
import {Routes} from './adapter/routes/index.mjs';
import {Controller} from './adapter/controller/index.mjs';
import { Usecase } from './usecase/index.js';
import ToolsUseCase from './external/service/toolsToUseCase.mjs';
import { ImageAnalyzer } from './external/database/mysql/imageAnalyzerImplements.js';
import { CustomerMySQL } from './external/database/mysql/customerImplements.js';

const host = '127.0.0.1'
const port = 3000;

const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'image_analyzer',
}

const tools = new ToolsUseCase();
const imageHandle = new ImageAnalyzer(conn);
const customer = new CustomerMySQL(conn);
const usecase = new Usecase(tools, imageHandle, customer);

const server = createServer((req, res) => {
    try {
        const controller = new Controller(req, res, usecase);
        new Routes(controller);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: 'internal error',
        }));
    }
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});


process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});