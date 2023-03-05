import { AwsLambdaReceiver } from "@slack/bolt";
import dotenv from "dotenv";

import { logger } from "./@lib";
import { AppFactory } from "./appConfig";
import { INPUT } from "./constants";
import { registerEZPRListeners } from "./ezpr";
import { PublishHomeOverview, registerHelpListeners } from "./help";

dotenv.config();

const USER_ID = process.env.USER_ID;

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});

const factory = new AppFactory(awsLambdaReceiver);
const app = factory.build();

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  await ack();
});

registerEZPRListeners(app);
registerHelpListeners(app);

/* Start Bolt App */
app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
    // TODO: Should publish on home opened
    if (USER_ID !== "") {
      PublishHomeOverview(app.client);
    }
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
