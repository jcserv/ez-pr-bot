import { Block, KnownBlock } from "@slack/bolt";

import { error, ezprHelp, helpUsage } from "../help";
import helpOverview from "../help/overview.json";

export class HelpArguments {
  topic: string;
  message: (KnownBlock | Block)[];
  numArgs?: number;
  input?: string;

  constructor(topic: string, numArgs?: number, input?: string) {
    this.topic = topic;
    this.message = renderMessage(topic);
    this.numArgs = numArgs;
    this.input = input;
  }
}

export function renderMessage(topic: string): (KnownBlock | Block)[] {
  switch (topic) {
    case "":
      return helpOverview.blocks;
    case "usage":
      return helpUsage;
    case "ezpr":
      return ezprHelp;
    default:
      return error(topic);
  }
}
