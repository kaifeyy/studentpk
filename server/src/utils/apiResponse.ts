import { Response } from 'express';

export class ApiResponse {
  constructor(
    private res: Response,
    public statusCode: number,
    public data: any = {},
    public message: string = ''
  ) {}

  send() {
    return this.res.status(this.statusCode).json({
      success: this.statusCode >= 200 && this.statusCode < 300,
      message: this.message,
      data: this.data,
    });
  }

  static success(res: Response, data: any = {}, message: string = 'Success') {
    return new ApiResponse(res, 200, data, message).send();
  }

  static created(res: Response, data: any = {}, message: string = 'Created') {
    return new ApiResponse(res, 201, data, message).send();
  }

  static badRequest(res: Response, message: string = 'Bad Request', data: any = {}) {
    return new ApiResponse(res, 400, data, message).send();
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return new ApiResponse(res, 401, {}, message).send();
  }

  static forbidden(res: Response, message: string = 'Forbidden') {
    return new ApiResponse(res, 403, {}, message).send();
  }

  static notFound(res: Response, message: string = 'Not Found') {
    return new ApiResponse(res, 404, {}, message).send();
  }

  static error(res: Response, message: string = 'Internal Server Error', statusCode: number = 500) {
    return new ApiResponse(res, statusCode, {}, message).send();
  }
}
