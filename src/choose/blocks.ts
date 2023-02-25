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

function formatHasHave(items: string[]): string {
  if (items.length <= 1) {
    return "has";
  }
  return "have";
}

export const rollDiceMessage = (
  chosen: string[],
  channel: Channel
): SlackMessage => {
  const msg1 = `\\*rolls dice\\*\nRolled a ${_.random(1, 6)}, ${formatNItems(
    chosen
  )}, they have been chosen!`;
  return new SlackMessage(simpleMessage(msg1), channel, msg1);
};

export const spinWheelMessage = (
  chosen: string[],
  channel: Channel
): SlackMessage => {
  const msg1 = `\\*spins wheel\\*\nIt stopped on ${formatNItems(
    chosen
  )}, they have been chosen!`;
  return new SlackMessage(simpleMessage(msg1), channel, msg1);
};

export const drawStrawsMessage = (
  chosen: string[],
  channel: Channel
): SlackMessage => {
  const msg1 = `\\*hands out straws\\*\n${formatNItems(
    chosen
  )} drew the short straw, they have been chosen!`;
  return new SlackMessage(simpleMessage(msg1), channel, msg1);
};

export const pickACardMessage = (
  chosen: string[],
  channel: Channel
): SlackMessage => {
  const msg1 = `\\*pulls a card\\*\n${formatNItems(
    chosen
  )} - is this your card? ${formatNItems(chosen)} ${formatHasHave(
    chosen
  )} been chosen!`;
  return new SlackMessage(simpleMessage(msg1), channel, msg1);
};

export const flipCoinMessage = (
  chosen: string[],
  channel: Channel
): SlackMessage => {
  const msg1 = `\\*flips a coin\\*\nIt's ${_.sample([
    "heads",
    "tails",
  ])}! ${formatNItems(chosen)} ${formatHasHave(chosen)} been chosen!`;
  return new SlackMessage(simpleMessage(msg1), channel, msg1);
};
