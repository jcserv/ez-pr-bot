import { WebClient } from "@slack/web-api";
import _ from "lodash";

import { PostMessageCommand } from "../cmd";
import { ICommand, SlackMessage } from "../types";
import { ChooseArguments } from "./";
import {
  drawStrawsMessage,
  flipCoinMessage,
  pickACardMessage,
  rollDiceMessage,
  spinWheelMessage,
} from "./blocks";

export class ChooseCommand implements ICommand {
  client: WebClient;

  input: string;
  args: ChooseArguments;

  constructor(client: WebClient, args: ChooseArguments) {
    this.client = client;
    this.args = args;
    this.input = args.input || "";
  }

  generateMessage(chosen: string[]): SlackMessage {
    const r = _.random(1, 5);
    switch (r) {
      case 1:
        return rollDiceMessage(chosen, this.args.channel);
      case 2:
        return spinWheelMessage(chosen, this.args.channel);
      case 3:
        return drawStrawsMessage(chosen, this.args.channel);
      case 4:
        return pickACardMessage(chosen, this.args.channel);
      default:
        return flipCoinMessage(chosen, this.args.channel);
    }
  }

  async handle() {
    const chosen = _.sampleSize(
      _.difference(this.args.include, this.args.exclude),
      this.args.amount
    );
    const message = this.generateMessage(chosen);
    const command = new PostMessageCommand(this.client, message);
    await command.handle();
  }
}
