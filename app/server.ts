import { createServer } from 'node:http';
import Routes from './adapter/routes';
import Controller from './adapter/controller';
import Usecase from './usecase';
import ToolsUseCase from './external/service/toolsToUseCase';
import { ImageAnalyzer } from './external/database/mysql/imageAnalyzerImplements';
import { CustomerMySQL } from './external/database/mysql/customerImplements';

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
    const controller = new Controller(req, res, usecase);
    new Routes(controller);
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});


