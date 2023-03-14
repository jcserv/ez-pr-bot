import { App, BlockAction } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

import { Logger } from "../../../../common";
import { errorOccurred, PublishInteractionCountMetric } from "../../@lib";
import { ACTION, EZPR, OPEN_EZPR_MODAL, SHORTCUT } from "../../constants";
import { OpenEZPRModal } from "../cmd";

export function registerActionListener(app: App<StringIndexed>) {
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
      Logger.error(error);
    }
  });
}

export function registerShortcutListener(app: App<StringIndexed>) {
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
      Logger.error(error);
    }
  });
}
