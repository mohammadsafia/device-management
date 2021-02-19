export class HttpError extends Error {
  code = 400;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
