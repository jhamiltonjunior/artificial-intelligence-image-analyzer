import { IncomingMessage, ServerResponse } from "http";
import { Controller } from "../../../app/adapter/controller/index.mjs";
import { IUseCase, response, responseRegister } from "../../../app/domains/repository/index.js";

class MockResponse extends ServerResponse {
  public statusCode: number = 200;
  public responseData: any = null;

  constructor() {
    super(new IncomingMessage(new (require('net').Socket)()));
  }

  writeHead(statusCode: number, headers?: any): this {
    this.statusCode = statusCode;
    return this;
  }

  end(data?: any): this {
    this.responseData = data;
    return this;
  }
}

const mockUseCase: IUseCase = {
  handleUpload: async (data: any): Promise<responseRegister> => {
    return {
      code: 200,
      image_url: 'http://example.com/image.jpg',
      measure_value: 42,
      measure_uuid: 'uuid-1234',
    };
  },
  confirm: async (data: any): Promise<response | undefined> => {
    return { code: 200, message: 'Confirmed successfully' };
  },
  handleList: async (customerCode: string, mensureType: string): Promise<response | undefined> => {
    return { code: 404, error_code: 'MEASURES_NOT_FOUND', message: 'Nenhuma leitura encontrada' };
  },
};

describe("Controller", () => {
  let req: IncomingMessage;
  let res: MockResponse;
  let controller: Controller;

  beforeEach(() => {
    req = new IncomingMessage(new (require('net').Socket)());
    res = new MockResponse();
    controller = new Controller(req, res, mockUseCase);
  });

  test("should return 500 on upload if JSON parsing fails", async () => {
    req.push('invalid json');
    req.emit('end');

    await controller.upload();

    console.assert(res.statusCode === 500, "Expected status code 500");
    console.assert(res.responseData === JSON.stringify({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'error to parse JSON',
    }), "Expected error response");
  });

  test("should call usecase.handleUpload on successful JSON parsing", async () => {
    const body = { image: 'test-image' };
    req.push(JSON.stringify(body));
    req.emit('end');

    await controller.upload();

    console.assert(res.statusCode === 200, "Expected status code 200");
    console.assert(res.responseData === JSON.stringify({
      image_url: 'http://example.com/image.jpg',
      measure_value: 42,
      measure_uuid: 'uuid-1234',
    }), "Expected successful upload response");
  });

  test("should return 404 if no measures found in handleList", async () => {
    const customerCode = "customer123";
    const searchParams = new URLSearchParams({ measure_type: "temperature" });

    await controller.handleList(customerCode, searchParams);

    console.assert(res.statusCode === 404, "Expected status code 404");
    console.assert(res.responseData === JSON.stringify({
      error_code: "MEASURES_NOT_FOUND",
      message: "Nenhuma leitura encontrada",
    }), "Expected no measures found response");
  });

});
