import { createServer } from 'node:http';
import Routes from './adapter/routes';
import Controller from './adapter/controller';
import Usecase from './usecase';
import ToolsUseCase from './external/service/toolsToUseCase';

const host = '127.0.0.1'
const port = 3000;

const server = createServer((req, res) => {
    const tools = new ToolsUseCase();
    const usecase = new Usecase(tools);
    const controller = new Controller(req, res, usecase);
    new Routes(controller);
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});


