import { AwsLambdaReceiver } from "@slack/bolt";
import dotenv from "dotenv";
import { log } from "ez-pr-lib";

import { errorOccurred } from "./@lib";
import { AppFactory } from "./appConfig";
import { INPUT } from "./constants";
import { registerEZPRListeners } from "./ezpr";
import { PublishHomeOverview, registerHelpListeners } from "./help";

dotenv.config();

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
    log.error(error);
  }
});

registerEZPRListeners(app);
registerHelpListeners(app);

app
  .start()
  .then(() => {
    log.info("⚡️ Bolt app is running!");
  })
  .catch((error) => {
    log.error(error);
    process.exit(1);
  });
