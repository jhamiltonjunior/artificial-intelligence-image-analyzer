import { IncomingMessage, ServerResponse } from "node:http";
import { IController } from "../controller/interface";
import Controller from "../controller";

export default class Routes {
    private req: IncomingMessage;
    private res: ServerResponse;
    private controller: IController;

    constructor(controller: IController) {
        this.controller = controller;
        this.req = this.controller.getReq();
        this.res = this.controller.getRes();
        this.init();
    }

    private init() {
        const url = this.req.url || '';
        const path = new URL(url, `http://${this.req.headers.host}`).pathname;
        const handleMethodGet = path.split('/');

        if (this.req.method === 'GET' && handleMethodGet.length === 3 && handleMethodGet[2] === 'list') {
            this.controller.handleList(handleMethodGet[1]);
            return;
        }

        switch (url && this.req.method) {
            case '/upload' && 'POST':
                this.controller.upload();
                break;
            case '/confirm' && 'PATCH':
                this.controller.confirm();
                break;
            default:
                this.controller.notFound();
                break;
        }
    }
}