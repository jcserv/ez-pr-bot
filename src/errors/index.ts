import { ZodError, ZodIssue } from "zod";
import {
  unableToParseCommand,
  unableToParseCommandWithInput,
} from "./markdown";

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

function toString(issue: ZodIssue): string {
  return `- ${issue.code}: ${issue.path} | ${issue.message}\n`;
}

export class ValidationError extends Error {
  issues: ZodIssue[];
  input?: string;

  constructor(msg: string, issues: ZodIssue[], input?: string) {
    super(msg);
    this.issues = issues;
    this.input = input;
  }

  toString(): string {
    var output: string = this.input
      ? unableToParseCommandWithInput(this.input)
      : unableToParseCommand;

    this.issues.forEach((issue) => {
      output += toString(issue);
    });

    return output;
  }
}

export function isValidationError(obj: any): obj is ValidationError {
  if (obj instanceof ValidationError) {
    return true;
  }
  return false;
}

export function toValidationError(
  obj: any,
  input?: string
): ValidationError | null {
  if (isZodError(obj)) {
    return new ValidationError(unableToParseCommand, obj.issues, input);
  }
  return obj;
}

export function isZodError(obj: any): obj is ZodError {
  if (obj instanceof ZodError) {
    return true;
  }
  return false;
}
