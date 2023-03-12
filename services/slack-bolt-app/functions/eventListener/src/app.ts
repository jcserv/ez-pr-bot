import { AwsLambdaReceiver } from "@slack/bolt";
import dotenv from "dotenv";

import { errorOccurred, logger } from "./@lib";
import { AppFactory, ExpressReceiverFactory } from "./appConfig";
import { INPUT } from "./constants";
import { registerEZPRListeners } from "./ezpr";
import { PublishHomeOverview, registerHelpListeners } from "./help";

dotenv.config();

export const expressReceiver = new ExpressReceiverFactory().build();
export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});

export const app = new AppFactory(awsLambdaReceiver).build();

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  ack();
});

app.event("app_home_opened", async ({ client, event }) => {
  try {
    PublishHomeOverview(client, event.user);
  } catch (error) {
    errorOccurred(client, event.user, event.channel, error);
    logger.error(error);
  }
});

registerEZPRListeners(app);
registerHelpListeners(app);

app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });