import serverlessExpress from "@vendia/serverless-express";
import { Handler } from "aws-lambda";

import { expressReceiver } from "./app";

export const oauth: Handler = serverlessExpress({
  app: expressReceiver.app,
});
