import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

import { isHTTPError, Logger } from "../../../../common";
import { isValidationError, toValidationError } from ".";

dotenv.config();

export async function errorOccurred(
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
      token: process.env.SLACK_BOT_TOKEN,
      channel,
      text: output,
      user,
    });
  } catch (error) {
    Logger.error(error);
  }
}
