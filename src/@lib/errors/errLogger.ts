import { WebClient } from "@slack/web-api";

import { logger } from "../logger";
import { isHTTPError, isValidationError, toValidationError } from ".";

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
    logger.error(error);
  }
}
