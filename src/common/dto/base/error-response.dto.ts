export class ErrorResponse {
  code: string;
  message: string;

  static generateError(code: string, message: string) {
    const result = new ErrorResponse();
    result.code = code;
    result.message = message;

    return result;
  }
}
