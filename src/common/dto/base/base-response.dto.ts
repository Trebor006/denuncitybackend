export class BaseResponse {
  statusCode: number;
  message: string;
  data: any;

  static generateOkResponse(message: string, data: any) {
    const result = new BaseResponse();
    result.statusCode = 200;
    result.message = message;
    result.data = data;

    return result;
  }

  static generateError(message: string, error: any) {
    const result = new BaseResponse();
    result.statusCode = 400;
    result.message = message;
    result.data = error;

    return result;
  }
}
