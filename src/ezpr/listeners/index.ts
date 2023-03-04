/* eslint-disable @typescript-eslint/no-var-requires */
import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

const openEZPRModal = require("./openEzprModal");
const submitEZPRForm = require("./submitEzprForm");
const submitEZPRCommand = require("./submitEzprCommand");

export function registerEZPRListeners(app: App<StringIndexed>) {
  openEZPRModal.registerActionListener(app);
  openEZPRModal.registerShortcutListener(app);
  submitEZPRForm.registerViewListener(app);
  submitEZPRCommand.registerCommandListener(app);
}
