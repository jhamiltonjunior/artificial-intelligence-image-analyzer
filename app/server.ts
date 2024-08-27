import { createServer } from 'node:http';
import Routes from './external/routes';

const host = '127.0.0.1'
const port = 3000;

const server = createServer((req, res) => {
    new Routes(req, res);
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});


