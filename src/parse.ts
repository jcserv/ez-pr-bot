const EMPTY_STRING = "";
const SPACE = " ";
const SINGLE_QUOTES = "'";
const DOUBLE_QUOTES = '"';

// parseCommandArgs parses Slack command arguments and returns a string containing each
// argument. It treats input wrapped in quotes as one argument.
export function parseCommandArgs(text: string): string[] {
  const str = text.trim();
  if (str === EMPTY_STRING) {
    return [];
  }

  var ret: string[] = [];
  var currArg: string = EMPTY_STRING;
  var startParsing: boolean = true;
  var terminateOnChar: string = SPACE;

  for (const ch of str) {
    if (startParsing) {
        if (ch == SINGLE_QUOTES) {
          terminateOnChar = SINGLE_QUOTES;
        } else if (ch == DOUBLE_QUOTES) {
          terminateOnChar = DOUBLE_QUOTES;
        } else {
          terminateOnChar = SPACE;
          if (ch != terminateOnChar) {
            currArg += ch
        }
        }
        startParsing = false
        continue
      } else if (ch === terminateOnChar) {
        ret.push(currArg);
        currArg = EMPTY_STRING;
        startParsing = true
        continue
      }
      currArg += ch;
  }
  
  if (currArg !== EMPTY_STRING) {
    ret.push(currArg);
  }

  return ret;
}
