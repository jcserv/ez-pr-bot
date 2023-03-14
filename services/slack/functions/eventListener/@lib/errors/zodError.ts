import { ZodError, ZodIssue } from "zod";

import {
  unableToParseCommand,
  unableToParseCommandWithInput,
} from "./markdown";

function toString(issue: ZodIssue): string {
  return `- ${issue.code}: ${issue.path} | ${issue.message}\n`;
}

export class ValidationError extends Error {
  issues: ZodIssue[];
  input?: string;

  constructor(msg: string, issues: ZodIssue[], input?: string) {
    super(msg);
    this.issues = issues;
    this.input = input || "";
  }

  toString(): string {
    let output: string = this.input
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
