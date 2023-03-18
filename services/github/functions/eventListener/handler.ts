import {
  createLambdaFunction,
  createProbot,
} from "@probot/adapter-aws-lambda-serverless";
import { Handler } from "aws-lambda";

import appFn from "./app";

export const events: Handler = async () => {
  return createLambdaFunction(appFn, {
    probot: createProbot(),
  });
};
