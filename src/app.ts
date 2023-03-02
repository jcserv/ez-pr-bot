import {
  App,
  AwsLambdaReceiver,
  BlockAction,
  SlackViewAction,
} from "@slack/bolt";
import dotenv from "dotenv";

import {
  errorOccurred,
  logger,
  PublishInteractionCountMetric,
  PublishUsageMetrics,
} from "./@lib";
import {
  ACTION,
  COMMAND,
  DEV,
  EZPR,
  EZPR_MODAL_SUBMISSION,
  HELP,
  INPUT,
  OPEN_EZPR_MODAL,
  OPEN_HELP_USAGE_MODAL,
  SHORTCUT,
  SLASH_EZPR,
  SLASH_HELP,
  VIEW,
} from "./constants";
import {
  EZPRCommand,
  OpenEZPRModal,
  ParseEZPRFormSubmission,
  ParseEZPRSlashCommand,
} from "./ezpr";
import {
  HelpCommand,
  OpenHelpUsageModal,
  ParseSlashHelpCommand,
  PublishHomeOverview,
} from "./help";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const USER_ID = process.env.USER_ID;

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});
let app = new App({
  token: SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

if (NODE_ENV === DEV) {
  const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN || "";
  app = new App({
    appToken: SLACK_APP_TOKEN,
    token: SLACK_BOT_TOKEN,
    socketMode: true,
  });
  logger.info("Running in development mode");
}

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  await ack();
});

// EZPR

app.action({ action_id: OPEN_EZPR_MODAL }, async ({ ack, body, client }) => {
  const blockAction = body as BlockAction;
  try {
    await ack();
    OpenEZPRModal(client, blockAction.trigger_id);
    PublishInteractionCountMetric(ACTION, EZPR);
  } catch (error) {
    const { user, channel } = blockAction;
    if (user !== undefined && channel !== undefined) {
      errorOccurred(client, user.id, channel.id, error);
    }
    logger.error(error);
  }
});

app.shortcut(OPEN_EZPR_MODAL, async ({ ack, client, shortcut }) => {
  try {
    await ack();
    OpenEZPRModal(client, shortcut.trigger_id);
    PublishInteractionCountMetric(SHORTCUT, EZPR);
  } catch (error) {
    const { user } = shortcut;
    if (user !== undefined) {
      errorOccurred(client, user.id, "", error);
    }
    logger.error(error);
  }
});

app.view(EZPR_MODAL_SUBMISSION, async ({ ack, body, client, payload }) => {
  try {
    await ack();
    const args = await ParseEZPRFormSubmission(client, body, payload);
    const command = new EZPRCommand(client, args);
    await command.handle();
    PublishUsageMetrics(VIEW, EZPR, args.numArgs || 0);
  } catch (error) {
    const { user } = body as SlackViewAction;
    if (user !== undefined) {
      errorOccurred(client, user.id, "", error);
    }
    logger.error(error);
  }
});

app.command(SLASH_EZPR, async ({ ack, client, payload }) => {
  try {
    const args = ParseEZPRSlashCommand(payload);
    const command = new EZPRCommand(client, args);
    await command.handle();
    PublishUsageMetrics(COMMAND, EZPR, args.numArgs || 0);
  } catch (error) {
    const { user_id, channel_id } = payload;
    errorOccurred(client, user_id, channel_id, error);
    logger.error(error);
  } finally {
    ack();
  }
});

// HELP

app.action(
  { action_id: OPEN_HELP_USAGE_MODAL },
  async ({ ack, body, client }) => {
    await ack();
    const blockAction = body as BlockAction;
    try {
      OpenHelpUsageModal(client, blockAction.trigger_id);
      PublishInteractionCountMetric(ACTION, HELP);
    } catch (error) {
      const { user, channel } = blockAction;
      if (user !== undefined && channel !== undefined) {
        errorOccurred(client, user.id, channel.id, error);
      }
      logger.error(error);
    }
  }
);

app.command(SLASH_HELP, async ({ ack, client, payload }) => {
  try {
    const args = ParseSlashHelpCommand(payload);
    const command = new HelpCommand(ack, args);
    await command.handle();
    PublishUsageMetrics(COMMAND, HELP, args.numArgs || 0);
  } catch (error) {
    const { user_id, channel_id } = payload;
    errorOccurred(client, user_id, channel_id, error);
    logger.error(error);
  }
});

app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
    if (USER_ID !== undefined) {
      PublishHomeOverview(app.client);
    }
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
