import { ViewStateValue } from "@slack/bolt";

import {
  SELECTED_CONVERSATION,
  SELECTED_OPTION,
  SELECTED_USERS,
} from "../constants";
import { StringDictionary } from "../types";

export * from "../ezpr/form_submission";
export * from "../ezpr/slash_command";
export * from "../help/slash_command";

const EMPTY_STRING = "";
const SINGLE_QUOTES = "'";
const DOUBLE_QUOTES = '"';
const ASCII_DOUBLE_QUOTES_START = "“";
const ASCII_DOUBLE_QUOTES_END = "”";
const VALUE = "value";

const START_TERMINATORS = [
  SINGLE_QUOTES,
  DOUBLE_QUOTES,
  ASCII_DOUBLE_QUOTES_START,
];

function getStartToEndTerminatorDict(): StringDictionary {
  const d = new StringDictionary();
  d.Entries[SINGLE_QUOTES] = SINGLE_QUOTES;
  d.Entries[DOUBLE_QUOTES] = DOUBLE_QUOTES;
  d.Entries[ASCII_DOUBLE_QUOTES_START] = ASCII_DOUBLE_QUOTES_END;
  return d;
}

// parseCommandArgs parses Slack command arguments and returns a string containing each
// argument. It treats input wrapped in quotes as one argument.
export function parseCommandArgs(text: string): string[] {
  if (text === EMPTY_STRING) {
    return [];
  }

  const startToEndTerminatorDict = getStartToEndTerminatorDict();

  const ret: string[] = [];
  const s = text.split(" ");
  let currArg: string = EMPTY_STRING;
  let terminateOnChar: string = EMPTY_STRING;

  s.forEach((item) => {
    if (
      START_TERMINATORS.includes(item[0]) &&
      terminateOnChar === EMPTY_STRING
    ) {
      if (item.endsWith(startToEndTerminatorDict.Entries[item[0]])) {
        ret.push(item.slice(1, item.length - 1));
      } else {
        currArg += item.slice(1);
        terminateOnChar = startToEndTerminatorDict.Entries[item[0]];
      }
    } else if (
      terminateOnChar !== EMPTY_STRING &&
      item.endsWith(terminateOnChar)
    ) {
      currArg += " " + item.slice(0, item.length - 1);
      terminateOnChar = EMPTY_STRING;
      ret.push(currArg);
      currArg = EMPTY_STRING;
    } else if (terminateOnChar !== EMPTY_STRING) {
      currArg += " " + item;
    } else {
      ret.push(item);
    }
  });

  if (currArg !== EMPTY_STRING) {
    ret.push(currArg.slice(0, currArg.length - 1));
  }

  return ret;
}

export function isFlagProvided(args: string[], flag: string) {
  return args.includes(flag) && args.length > args.indexOf(flag) + 1;
}

export function mapUntilFlagEncountered(
  args: string[],
  startIndex = 0
): string[] {
  const output = [];
  for (let i = startIndex; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      break;
    }
    output.push(args[i]);
  }
  return output;
}

export interface FormValues {
  [blockId: string]: {
    [actionId: string]: ViewStateValue;
  };
}

export function getInputValue(
  values: FormValues,
  block_id: string,
  value = VALUE,
  action_id = "input"
): any {
  const viewStateValue = values?.[block_id]?.[action_id];
  switch (value) {
    case VALUE:
      return getValue(viewStateValue);
    case SELECTED_CONVERSATION:
      return getSelectedConversation(viewStateValue);
    case SELECTED_OPTION:
      return getSelectedOption(viewStateValue);
    case SELECTED_USERS:
      return getSelectedUsers(viewStateValue);
  }
  return null;
}

function getValue(viewStateValue: ViewStateValue): string {
  return viewStateValue.value || "";
}

function getSelectedOption(viewStateValue: ViewStateValue): string {
  return viewStateValue.selected_option?.value || "";
}

function getSelectedConversation(viewStateValue: ViewStateValue): string {
  return viewStateValue.selected_conversation || "";
}

function getSelectedUsers(viewStateValue: ViewStateValue): string[] {
  return viewStateValue.selected_users || [];
}
