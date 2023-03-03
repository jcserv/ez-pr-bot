import {
  App,
  AwsLambdaReceiver,
  BlockAction,
  FileInstallationStore,
  SlackViewAction,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

import {
  errorOccurred,
  logger,
  PublishInteractionCountMetric,
  PublishUsageMetrics,
} from "./@lib";
import { customRoutes } from "./auth";
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
  PROD,
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
import scopes from "./scopes.json";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const USER_ID = process.env.USER_ID;

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});

let app: App<StringIndexed>;

switch (NODE_ENV) {
  case PROD:
    app = new App({
      token: SLACK_BOT_TOKEN,
      receiver: awsLambdaReceiver,
    });
    break;
  case DEV:
    app = new App({
      appToken: process.env.SLACK_APP_TOKEN || "",
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
      stateSecret: process.env.STATE_SECRET || "",
      customRoutes,
      scopes,
      installationStore: new FileInstallationStore(),
      socketMode: true,
    });
    logger.info("Running in development mode");
    break;
  default:
    logger.error("Environment not specified, shutting down.");
    process.exit(1);
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

/* Start Bolt App */
app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
    // TODO: Should publish using installation details
    if (USER_ID !== "") {
      PublishHomeOverview(app.client);
    }
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
