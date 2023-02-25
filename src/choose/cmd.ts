import { WebClient } from "@slack/web-api";
import _ from "lodash";

import { PostMessageCommand } from "../cmd";
import { ICommand, SlackMessage } from "../types";
import { ChooseArguments } from "./";
import { diceMessages } from "./blocks";

export class ChooseCommand implements ICommand {
  client: WebClient;

  input: string;
  args: ChooseArguments;

  constructor(client: WebClient, args: ChooseArguments) {
    this.client = client;
    this.args = args;
    this.input = args.input || "";
  }

  generateMessages(chosen: string[]): SlackMessage[] {
    // switch (chosen.length) {
    //   case 1:
    //     return diceMessages(channel);
    // }
    return diceMessages(chosen, this.args.channel);
  }

  async handle() {
    const chosen = _.sampleSize(
      _.difference(this.args.include, this.args.exclude),
      this.args.amount
    );
    const messages = this.generateMessages(chosen);
    messages.forEach(async (msg) => {
      const command = new PostMessageCommand(this.client, msg);
      await command.handle();
    });
  }
}
