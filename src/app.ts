import { AwsLambdaReceiver } from "@slack/bolt";
import dotenv from "dotenv";

import { errorOccurred, logger } from "./@lib";
import { AppFactory } from "./appConfig";
import { INPUT } from "./constants";
import { registerEZPRListeners } from "./ezpr";
import { PublishHomeOverview, registerHelpListeners } from "./help";

dotenv.config();

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});

const factory = new AppFactory(awsLambdaReceiver);
const app = factory.build();

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  await ack();
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

/* Start Bolt App */
app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
