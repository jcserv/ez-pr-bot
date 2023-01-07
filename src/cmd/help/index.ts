import {
  AckFn,
  Block,
  HomeView,
  KnownBlock,
  RespondArguments,
  SlashCommand,
  View,
} from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { error, ezprHelp, helpUsage } from "../../blocks/help";
import { ICommand } from "../interface";
import { OpenModalCommand } from "../modal";
import helpOverview from "../../blocks/help/overview.json";

export class HelpCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  input: string;
  message: (KnownBlock | Block)[];

  constructor(ack: AckFn<string | RespondArguments>, payload: SlashCommand) {
    this.ack = ack;
    this.input = `${payload.command} ${payload.text}`;
    switch (payload.text) {
      case "":
        this.message = helpOverview.blocks;
        break;
      case "usage":
        this.message = helpUsage;
        break;
      case "ezpr":
        this.message = ezprHelp;
        break;
      default:
        this.message = error(payload.text);
    }
  }

  async handle() {
    await this.ack({
      blocks: this.message,
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

export function PublishHomeOverview(client: WebClient) {
  const USER_ID = process.env.USER_ID as string;
  client.views
    .publish({ user_id: USER_ID, view: helpOverview as HomeView })
    .catch((error) => console.error(error));
}
