import { Block } from "@slack/bolt";

const simpleMessage = (text: string) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text,
  },
});

export const diceMessages: Block[][] = [[simpleMessage("*rolls dice*")]];
