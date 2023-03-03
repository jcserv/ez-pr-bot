/* eslint-disable @typescript-eslint/no-var-requires */
import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

const openEZPRModal = require("./open_ezpr_modal");
const submitEZPRForm = require("./submit_ezpr_form");
const submitEZPRCommand = require("./submit_ezpr_command");

export function registerEZPRListeners(app: App<StringIndexed>) {
  openEZPRModal.registerActionListener(app);
  openEZPRModal.registerShortcutListener(app);
  submitEZPRForm.registerViewListener(app);
  submitEZPRCommand.registerCommandListener(app);
}
