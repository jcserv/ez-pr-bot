import { createLambdaFunction, createProbot } from "@probot/adapter-aws-lambda-serverless";
import { APIGatewayEvent, Context, Handler } from "aws-lambda";

import appFn from "./app";

export const events: Handler = async (
  _event: APIGatewayEvent,
  _context: Context) => {
    return createLambdaFunction(appFn, {
        probot: createProbot(),
      });
};