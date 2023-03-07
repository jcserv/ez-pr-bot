import { AwsCallback } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import serverlessExpress from "@vendia/serverless-express";
import { APIGatewayEvent, Context, Handler } from "aws-lambda";

import { app, expressReceiver } from "./app";

export const slack: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: AwsCallback
) => {
  // immediate response for warm-up plugin
  if (event.resource === "serverless-plugin-warmup") {
    return callback(null, "Lambda is warm!");
  }

  const handler: any = await app.start();
  return handler(event, context, callback);
};

export const slackOauth: Handler = serverlessExpress({
  app: expressReceiver.app,
});
