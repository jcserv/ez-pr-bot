import {
  createLambdaFunction,
  createProbot,
} from "@probot/adapter-aws-lambda-serverless";

import appFn from "./app";

module.exports.events = createLambdaFunction(appFn, {
  probot: createProbot(),
});
