import { App, SlackViewAction } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { log } from "ez-pr-lib";

import { errorOccurred, PublishUsageMetrics } from "../../@lib";
import { EZPR, EZPR_MODAL_SUBMISSION, VIEW } from "../../constants";
import { EZPRCommand } from "../cmd";
import { ParseEZPRFormSubmission } from "../formSubmission";

export function registerViewListener(app: App<StringIndexed>) {
  app.view(EZPR_MODAL_SUBMISSION, async ({ ack, body, client, payload }) => {
    try {
      await ack();
      const args = await ParseEZPRFormSubmission(body, payload);
      const command = new EZPRCommand(client, args);
      await command.handle();
      PublishUsageMetrics(VIEW, EZPR, args.numArgs || 0);
    } catch (error) {
      const { user } = body as SlackViewAction;
      if (user !== undefined) {
        errorOccurred(client, user.id, "", error);
      }
      log.error(error);
    }
  });
}
