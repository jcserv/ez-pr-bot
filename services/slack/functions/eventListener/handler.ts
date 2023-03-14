import { AwsCallback } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { APIGatewayEvent, Context, Handler } from "aws-lambda";

import { awsLambdaReceiver } from "./app";

export const events: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: AwsCallback
) => {
  // immediate response for warm-up plugin
  if (event.resource === "serverless-plugin-warmup") {
    return callback(null, "Lambda is warm!");
  }

  const handler = awsLambdaReceiver.toHandler();
  return handler(event, context, callback);
};
