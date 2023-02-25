import { Channel, SlackMessage } from "../types";

const simpleMessage = (text: string) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  },
];

export const diceMessages = (channel: Channel): SlackMessage[] => [
  new SlackMessage(simpleMessage("*rolls dice*"), channel, "Swag"),
];
