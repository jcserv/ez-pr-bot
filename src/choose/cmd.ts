import { AckFn, RespondArguments } from "@slack/bolt";

import { ICommand } from "../types";
import { ChooseArguments } from "./";

export class ChooseCommand implements ICommand {
  ack: AckFn<string | RespondArguments>;
  args: ChooseArguments;
  input: string;

  constructor(ack: AckFn<string | RespondArguments>, args: ChooseArguments) {
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
