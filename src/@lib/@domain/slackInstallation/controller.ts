import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from "@slack/bolt";

import SlackInstallationService from "./service";

export class SlackInstallationController implements InstallationStore {
  private service: SlackInstallationService;

  constructor() {
    this.service = new SlackInstallationService();
  }

  storeInstallation<AuthVersion extends "v1" | "v2">(
    installation: Installation<AuthVersion, boolean>
  ): Promise<void> {
    if (installation.team !== undefined) {
      return this.service.save(installation);
    }
    throw new Error("Failed saving installation data to installationStore");
  }

  fetchInstallation(
    query: InstallationQuery<boolean>
  ): Promise<Installation<"v1" | "v2", boolean>> {
    if (query.teamId !== undefined) {
      return this.service.get(query.teamId);
    }
    throw new Error("Failed saving installation data to installationStore");
  }
}
