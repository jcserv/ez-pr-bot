import { Block, KnownBlock } from "@slack/bolt";
import { z } from "zod";
import { error, ezprHelp, helpUsage } from "../help";
import helpOverview from "../help/overview.json";

export const SupportedTopicsSchema = z.enum(["", "usage", "ezpr"]);

const HelpArgumentsSchema = z.object({
  topic: SupportedTopicsSchema,
});

export class HelpArguments {
  topic: string;
  message: (KnownBlock | Block)[];
  input?: string;

  constructor(topic: string, input?: string) {
    const args = {
      topic: topic,
      input: input,
    };
    HelpArgumentsSchema.parse(args);
    this.topic = topic;
    this.message = renderMessage(topic);
    this.input = input;
  }
}

function renderMessage(topic: string): (KnownBlock | Block)[] {
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
