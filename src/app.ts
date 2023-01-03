import { App, AckFn, RespondArguments } from "@slack/bolt";
import { EZPRCommand, HelpCommand } from "./cmd";
import {
  isHTTPError,
  isValidationError,
  isZodError,
  toValidationError,
} from "./errors";

require("dotenv").config();

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const app = new App({
  appToken: SLACK_APP_TOKEN,
  token: SLACK_BOT_TOKEN,
  socketMode: true,
});

app.command("/ezpr", async ({ ack, client, say, payload }) => {
  try {
    const command = new EZPRCommand(ack, client, say, payload);
    await command.handle();
  } catch (error) {
    errorOccurred(ack, error);
    console.error(error);
  }
});

app.command("/help", async ({ ack, payload }) => {
  try {
    const command = new HelpCommand(ack, payload);
    await command.handle();
  } catch (error) {
    errorOccurred(ack, error);
    console.error(error);
  }
});

async function errorOccurred(
  ack: AckFn<string | RespondArguments>,
  error: any
) {
  var output = "An unexpected error occurred.";
  error = toValidationError(error);

  if (isHTTPError(error) || isValidationError(error)) {
    output = error.toString();
  }

  await ack({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: output,
        },
      },
    ],
    response_type: "ephemeral",
  });
}

app.start().catch((error) => {
  console.error(error);
  process.exit(1);
});
