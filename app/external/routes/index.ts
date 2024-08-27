import { IncomingMessage, ServerResponse } from "node:http";
import Controller from "../controller";

export default class Routes extends Controller {

    constructor(req:IncomingMessage, res: ServerResponse) {
        super(req, res);
        this.init();
    }

    private init() {
        const url = this.req.url || '';
        const path = new URL(url, `http://${this.req.headers.host}`).pathname;
        const handleMethodGet = path.split('/');

        if (this.req.method === 'GET' && handleMethodGet.length === 3 && handleMethodGet[2] === 'list') {
            this.handleList(handleMethodGet[1]);
        } else {
            switch (url && this.req.method) {
                case '/upload' && 'POST':
                    this.upload();
                    break;
                case '/confirm' && 'PATCH':
                    this.confirm();
                    break;
                default:
                    this.notFound();
                    break;
            }
        }
    }
}