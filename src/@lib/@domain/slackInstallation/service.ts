import { Installation } from "@slack/bolt";

import SlackInstallationStore from "./db";

export default class SlackInstallationService {
  private store: SlackInstallationStore;

  constructor() {
    this.store = new SlackInstallationStore();
  }

  get(id: string): Promise<Installation<"v1" | "v2", boolean>> {
    return this.store.get(id);
  }

  save(installation: any): Promise<void> {
    return this.store.save(installation);
  }
}
