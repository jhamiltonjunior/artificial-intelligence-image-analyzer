import { IncomingMessage, ServerResponse } from "node:http";

export default class Routes {
    private req: IncomingMessage;
    private res: ServerResponse;

    constructor(req:IncomingMessage, res: ServerResponse) {
        this.req = req;
        this.res = res;

        switch (req.url) {
            case '/':
                this.upload();
                break;
            case '/about':
                // this.about();
                break;
            default:
                this.notFound();
                break;
        }
    }

    private async upload() {
        this.res.writeHead(201, { 'Content-Type': 'text/plain' });
        this.res.end('Upload is work\n');
    }

    private async notFound() {
        this.res.writeHead(404, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify({ message: 'Not Found' }));
    }
}