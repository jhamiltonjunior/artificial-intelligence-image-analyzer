import { createServer } from 'node:http';
import Routes from './external/routes';
import Controller from './external/controller';
import Usecase from './usecase';

const host = '127.0.0.1'
const port = 3000;

const server = createServer((req, res) => {
    const usecase = new Usecase();
    const controller = new Controller(req, res, usecase);
    new Routes(controller);
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});


