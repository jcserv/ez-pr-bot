import { AckFn, HomeView, RespondArguments, View } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

import { ICommand, logger, OpenModalCommand } from "../@lib";
import { HelpArguments, helpUsage } from ".";
import helpOverview from "./overview.json";

export * from "./blocks";

export class HelpCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  args: HelpArguments;
  input: string;

  constructor(ack: AckFn<string | RespondArguments>, args: HelpArguments) {
    this.ack = ack;
    this.args = args;
    this.input = args.input || "";
  }

  async handle() {
    await this.ack({
      blocks: this.args.message,
      response_type: "ephemeral",
    });
  }
}

// OpenHelpUsageModal is a utility wrapper function that opens the modal version of /help usage
export function OpenHelpUsageModal(client: WebClient, trigger_id: string) {
  const modal = {
    type: "modal",
    callback_id: "view_2",
    title: {
      type: "plain_text",
      text: "Help Usage",
    },
    blocks: helpUsage,
  };

  const command = new OpenModalCommand(client, trigger_id, modal as View);
  return command.handle();
}

export function PublishHomeOverview(client: WebClient, user_id: string) {
  client.views
    .publish({ user_id, view: helpOverview as HomeView })
    .catch((error) => logger.error(error));
}
