import {
  App,
  AwsLambdaReceiver,
  BlockAction,
  SlackViewAction,
} from "@slack/bolt";
import {
  AwsCallback,
  AwsEvent,
} from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

import {
  EZPRCommand,
  HelpCommand,
  OpenEZPRModal,
  OpenHelpUsageModal,
  PublishHomeOverview,
} from "./cmd";
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
import { isHTTPError, isValidationError, toValidationError } from "./errors";
import { logger } from "./logger";
import { createArgsCountMetric, createInteractionCountMetric } from "./metrics";
import {
  ParseEZPRFormSubmission,
  ParseEZPRSlashCommand,
  ParseSlashHelpCommand,
} from "./parse";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const USER_ID = process.env.USER_ID;

const awsLambdaReceiver = new AwsLambdaReceiver({
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
    const interactionCountMetric = createInteractionCountMetric(ACTION, EZPR);
    await interactionCountMetric.publish();
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
    const interactionCountMetric = createInteractionCountMetric(SHORTCUT, EZPR);
    await interactionCountMetric.publish();
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
    const interactionCountMetric = createInteractionCountMetric(VIEW, EZPR);
    await interactionCountMetric.publish();
    const argsCountMetric = createArgsCountMetric(VIEW, EZPR);
    await argsCountMetric.publish(args.numArgs);
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
    const interactionCountMetric = createInteractionCountMetric(COMMAND, EZPR);
    await interactionCountMetric.publish();
    const argsCountMetric = createArgsCountMetric(COMMAND, EZPR);
    await argsCountMetric.publish(args.numArgs);
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
      const interactionCountMetric = createInteractionCountMetric(ACTION, HELP);
      await interactionCountMetric.publish();
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
    const interactionCountMetric = createInteractionCountMetric(COMMAND, HELP);
    await interactionCountMetric.publish();
    const argsCountMetric = createArgsCountMetric(COMMAND, EZPR);
    await argsCountMetric.publish(args.numArgs);
  } catch (error) {
    const { user_id, channel_id } = payload;
    errorOccurred(client, user_id, channel_id, error);
    logger.error(error);
  }
});

async function errorOccurred(
  client: WebClient,
  user: string,
  channel: string,
  error: any
) {
  let output = "An unexpected error occurred.";
  error = toValidationError(error);

  if (isHTTPError(error) || isValidationError(error)) {
    output = error.toString();
  }

  try {
    await client.chat.postEphemeral({
      token: SLACK_BOT_TOKEN,
      channel,
      text: output,
      user,
    });
  } catch (error) {
    logger.error(error);
  }
}

app
  .start()
  .then(() => {
    if (USER_ID !== undefined) {
      PublishHomeOverview(app.client);
    }
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });

module.exports.handler = async (
  event: AwsEvent,
  context: any,
  callback: AwsCallback
) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
