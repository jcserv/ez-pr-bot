import { App, BlockAction } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { log } from "ez-pr-lib";

import { errorOccurred, PublishInteractionCountMetric } from "../../@lib";
import { ACTION, HELP, OPEN_HELP_USAGE_MODAL } from "../../constants";
import { OpenHelpUsageModal } from "../cmd";

export function registerActionListener(app: App<StringIndexed>) {
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
        log.error(error);
      }
    }
  );
}
