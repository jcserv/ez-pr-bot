import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { log } from "ez-pr-lib";

import { errorOccurred, PublishUsageMetrics } from "../../@lib";
import { COMMAND, HELP, SLASH_HELP } from "../../constants";
import { HelpCommand } from "../cmd";
import { ParseSlashHelpCommand } from "../slashCommand";

export function registerCommandListener(app: App<StringIndexed>) {
  app.command(SLASH_HELP, async ({ ack, client, payload }) => {
    try {
      const args = ParseSlashHelpCommand(payload);
      const command = new HelpCommand(ack, args);
      await command.handle();
      PublishUsageMetrics(COMMAND, HELP, args.numArgs || 0);
    } catch (error) {
      const { user_id, channel_id } = payload;
      errorOccurred(client, user_id, channel_id, error);
      log.error(error);
    }
  });
}
