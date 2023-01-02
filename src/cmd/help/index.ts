import { AckFn, Block, KnownBlock, RespondArguments, SlashCommand } from "@slack/bolt";
import { ICommand } from "../interface";
import { error, ezpr, overview, usage } from "./blocks";

export class HelpCommand implements ICommand {
  #ack: AckFn<string | RespondArguments>;
  #message: (KnownBlock | Block)[];

  constructor(ack: AckFn<string | RespondArguments>, payload: SlashCommand) {
    this.#ack = ack;

    switch (payload.text) {
      case "":
        this.#message = overview
        break
      case "usage":
        this.#message = usage
        break
      case "ezpr":
        this.#message = ezpr
        break
      default:
        this.#message = error(payload.text)
    }
  }

  async handle() {
    await this.#ack({
      blocks: this.#message,
      response_type: "ephemeral",
    });
  }
}
