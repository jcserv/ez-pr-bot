import {
  AckFn,
  Block,
  KnownBlock,
  RespondArguments,
  SlashCommand,
} from "@slack/bolt";
import { ICommand } from "../interface";
import { error, ezprHelp, helpOverview, helpUsage } from "./blocks";

export class HelpCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  message: (KnownBlock | Block)[];

  constructor(ack: AckFn<string | RespondArguments>, payload: SlashCommand) {
    this.ack = ack;

    switch (payload.text) {
      case "":
        this.message = helpOverview;
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
