import { IncomingMessage, ServerResponse } from "http";
import { Controller } from "./Controller"; // Ajuste o caminho se necessário
import { IUseCase } from "../../domains/repository/index.js";

// Mock do IUseCase
const mockUseCase = {
  handleUpload: jest.fn(),
  confirm: jest.fn(),
  handleList: jest.fn(),
};

describe("Controller", () => {
  let req: IncomingMessage;
  let res: ServerResponse;
  let controller: Controller;

  beforeEach(() => {
    req = new IncomingMessage(new Socket());
    res = new ServerResponse(req);
    controller = new Controller(req, res, mockUseCase);
  });

  describe("upload", () => {
    it("deve responder com erro ao falhar na análise JSON", async () => {
      req.on = jest.fn((event, callback) => {
        if (event === 'data') {
          callback('invalid json');
        }
        if (event === 'end') {
          callback();
        }
      });

      await controller.upload();

      expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'error to parse JSON',
      }));
    });

    it("deve responder com sucesso ao fazer upload", async () => {
      req.on = jest.fn((event, callback) => {
        if (event === 'data') {
          callback(JSON.stringify({ some: 'data' }));
        }
        if (event === 'end') {
          callback();
        }
      });

      mockUseCase.handleUpload.mockResolvedValue({
        code: 200,
        image_url: "http://example.com/image.png",
        measure_value: 42,
        measure_uuid: "uuid-1234",
      });

      await controller.upload();

      expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({
        image_url: "http://example.com/image.png",
        measure_value: 42,
        measure_uuid: "uuid-1234",
      }));
    });
  });

  describe("confirm", () => {
    it("deve responder com erro ao falhar na análise JSON", async () => {
      req.on = jest.fn((event, callback) => {
        if (event === 'data
