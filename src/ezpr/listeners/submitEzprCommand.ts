import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

import { errorOccurred, logger, PublishUsageMetrics } from "../../@lib";
import { COMMAND, EZPR, SLASH_EZPR } from "../../constants";
import { EZPRCommand } from "../cmd";
import { ParseEZPRSlashCommand } from "../slashCommand";

export function registerCommandListener(app: App<StringIndexed>) {
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
}
