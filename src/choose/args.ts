import { Block, KnownBlock } from "@slack/bolt";

export class ChooseArguments {
  topic: string;
  message: (KnownBlock | Block)[];
  numArgs?: number;
  input?: string;

  constructor(topic: string, numArgs?: number, input?: string) {
    this.topic = topic;
    this.message = []; // renderMessage(topic);
    this.numArgs = numArgs;
    this.input = input;
  }
}
