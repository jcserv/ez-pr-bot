import _ from "lodash";

import { formatNItems } from "../helpers";
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

export const diceMessages = (
  chosen: string[],
  channel: Channel
): SlackMessage[] => {
  const msg1 = "*rolls dice*";
  const msg2 = `Rolled a ${_.random(1, 6)}, ${formatNItems(
    chosen
  )} has been chosen!`;

  return [
    new SlackMessage(simpleMessage(msg1), channel, msg1),
    new SlackMessage(simpleMessage(msg2), channel, msg2),
  ];
};
