/* eslint-disable @typescript-eslint/no-var-requires */
import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

const openHelpModal = require("./openHelpModal");
const submitHelpCommand = require("./submitHelpCommand");

export function registerHelpListeners(app: App<StringIndexed>) {
  openHelpModal.registerActionListener(app);
  submitHelpCommand.registerCommandListener(app);
}
