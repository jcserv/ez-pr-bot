import { ViewStateValue } from "@slack/bolt";
import {
  SELECTED_CONVERSATION,
  SELECTED_OPTION,
  SELECTED_USERS,
} from "../constants";

export * from "./ezpr";
export * from "./help";

const EMPTY_STRING = "";
const SINGLE_QUOTES = "'";
const DOUBLE_QUOTES = '"';

// parseCommandArgs parses Slack command arguments and returns a string containing each
// argument. It treats input wrapped in quotes as one argument.
export function parseCommandArgs(text: string): string[] {
  if (text === EMPTY_STRING) {
    return [];
  }

  var ret: string[] = [];
  const s = text.split(" ");
  var currArg: string = EMPTY_STRING;
  var terminateOnChar: string = EMPTY_STRING;
  s.forEach((item) => {
    if (
      (item.startsWith(SINGLE_QUOTES) || item.startsWith(DOUBLE_QUOTES)) &&
      terminateOnChar === EMPTY_STRING
    ) {
      currArg += item.slice(1);
      terminateOnChar = item[0];
    } else if (
      (item.endsWith(SINGLE_QUOTES) && terminateOnChar === SINGLE_QUOTES) ||
      (item.endsWith(DOUBLE_QUOTES) && terminateOnChar === DOUBLE_QUOTES)
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

const VALUE = "value";

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
