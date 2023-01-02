import { WebAPIPlatformError } from "@slack/web-api";

export interface IError {
  message: string;
  toString(): string;
}

export class Error implements IError {
  message: string;

  constructor(msg: string) {
    this.message = msg;
  }

  toString(): string {
    return this.message;
  }
}

export declare type StatusCode = 200 | 400 | 401 | 403 | 404 | 500;

type TStatusToName = {
  [key: number]: string;
};

const StatusToName: TStatusToName = {
  200: "Ok",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

export class HTTPError extends Error {
  name: string;
  code: StatusCode;
  input?: string;

  constructor(code: number, msg: string, input?: string) {
    super(msg);
    this.code = code as StatusCode;
    this.name = StatusToName[code];
    this.input = input;
  }

  toString(): string {
    return `${this.code} ${this.name} - ${super.toString()}`;
  }

  GetStatusCode(): number {
    return this.code as number;
  }
}

export function isHTTPError(obj: any): obj is HTTPError {
  if (obj instanceof HTTPError) {
    return true;
  }
  return false;
}
