import { App, BlockAction, SlackViewAction } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import {
  INPUT,
  EZPR_MODAL_SUBMISSION,
  OPEN_EZPR_MODAL,
  OPEN_HELP_USAGE_MODAL,
  SLASH_EZPR,
  SLASH_HELP,
} from "./constants";
import {
  EZPRCommand,
  HelpCommand,
  OpenEZPRModal,
  OpenHelpUsageModal,
  PublishHomeOverview,
} from "./cmd";
import { isHTTPError, isValidationError, toValidationError } from "./errors";
import { ParseEZPRFormSubmission, ParseEZPRSlashCommand } from "./parse";

require("dotenv").config();

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const USER_ID = process.env.USER_ID;

const app = new App({
  appToken: SLACK_APP_TOKEN,
  token: SLACK_BOT_TOKEN,
  socketMode: true,
});

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  await ack();
});

app.action({ action_id: OPEN_EZPR_MODAL }, async ({ ack, body, client }) => {
  await ack();
  const blockAction = body as BlockAction;
  try {
    OpenEZPRModal(client, blockAction.trigger_id);
  } catch (error) {
    const { user, channel } = blockAction;
    if (user !== undefined && channel !== undefined) {
      errorOccurred(client, user.id, channel.id, error);
    }
    console.error(error);
  }
});

app.view(EZPR_MODAL_SUBMISSION, async ({ ack, body, client, payload }) => {
  try {
    const args = ParseEZPRFormSubmission(body, payload);
    const command = new EZPRCommand(client, args);
    await command.handle();
  } catch (error) {
    const { user } = body as SlackViewAction;
    if (user !== undefined) {
      errorOccurred(client, user.id, "", error);
    }
    console.error(error);
  } finally {
    ack();
  }
});

app.command(SLASH_EZPR, async ({ ack, client, payload }) => {
  try {
    const args = ParseEZPRSlashCommand(payload);
    const command = new EZPRCommand(client, args);
    await command.handle();
  } catch (error) {
    const { user_id, channel_id } = payload;
    errorOccurred(client, user_id, channel_id, error);
    console.error(error);
  } finally {
    ack();
  }
});

app.action(
  { action_id: OPEN_HELP_USAGE_MODAL },
  async ({ ack, body, client }) => {
    await ack();
    const blockAction = body as BlockAction;
    try {
      OpenHelpUsageModal(client, blockAction.trigger_id);
    } catch (error) {
      const { user, channel } = blockAction;
      if (user !== undefined && channel !== undefined) {
        errorOccurred(client, user.id, channel.id, error);
      }
      console.error(error);
    }
  }
);

app.command(SLASH_HELP, async ({ ack, client, payload }) => {
  try {
    const command = new HelpCommand(ack, payload);
    await command.handle();
  } catch (error) {
    const { user_id, channel_id } = payload;
    errorOccurred(client, user_id, channel_id, error);
    console.error(error);
  }
});

async function errorOccurred(
  client: WebClient,
  user: string,
  channel: string,
  error: any
) {
  var output = "An unexpected error occurred.";
  error = toValidationError(error);

  if (isHTTPError(error) || isValidationError(error)) {
    output = error.toString();
  }

  try {
    await client.chat.postEphemeral({
      token: SLACK_BOT_TOKEN,
      channel: channel,
      text: output,
      user: user,
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    process.exit(1);
  });
