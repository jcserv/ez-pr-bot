/* eslint-disable @typescript-eslint/no-var-requires */
import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

import { registerActionListener } from "./openHelpModal";
import { registerCommandListener } from "./submitHelpCommand";

export function registerHelpListeners(app: App<StringIndexed>) {
  registerActionListener(app);
  registerCommandListener(app);
}
