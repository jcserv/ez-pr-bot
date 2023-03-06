/* eslint-disable @typescript-eslint/no-var-requires */
import { App } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

import {
  registerActionListener,
  registerShortcutListener,
} from "./openEzprModal";
import { registerCommandListener } from "./submitEzprCommand";
import { registerViewListener } from "./submitEzprForm";

export function registerEZPRListeners(app: App<StringIndexed>) {
  registerActionListener(app);
  registerShortcutListener(app);
  registerViewListener(app);
  registerCommandListener(app);
}
