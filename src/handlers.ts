import { AwsCallback } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { APIGatewayEvent, Context, Handler } from "aws-lambda";

import { workspaceInstallHtml } from "./@lib/auth/html";
import { awsLambdaReceiver } from "./app";

export const slack: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: AwsCallback
) => {
  // immediate response for warm-up plugin
  if (event.resource === "serverless-plugin-warmup") {
    return "Lambda is warm!";
  }

  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

export const slackInstall: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: AwsCallback
) => {
  if (event.resource === "serverless-plugin-warmup") {
    return "Lambda is warm!";
  }
  callback(null, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: workspaceInstallHtml,
    statusCode: 200,
  });
};
