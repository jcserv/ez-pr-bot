import { View, WebClient } from "@slack/web-api";

import { PostMessageCommand } from "../@lib/cmd";
import { OpenModalCommand } from "../@lib/cmd/openModal";
import { ICommand, SlackMessage } from "../@lib/types";
import { EZPRArguments } from "./args";
import { ezprMessage, ezprText } from "./blocks";
import ezprModal from "./modal.json";

export class EZPRCommand implements ICommand {
  client: WebClient;

  input: string;
  message: SlackMessage;

  constructor(client: WebClient, args: EZPRArguments) {
    this.client = client;
    this.input = args.input || "";
    this.message = new SlackMessage(
      ezprMessage(args),
      args.channel || "",
      ezprText(args)
    );
  }

  async handle() {
    const command = new PostMessageCommand(this.client, this.message);
    return await command.handle();
  }
}

// OpenEZPRModal is a utility wrapper function that opens the modal version of /ezpr
export function OpenEZPRModal(client: WebClient, trigger_id: string) {
  const command = new OpenModalCommand(client, trigger_id, ezprModal as View);
  return command.handle();
}
