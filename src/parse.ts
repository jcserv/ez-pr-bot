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
