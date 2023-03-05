import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from "@slack/bolt";

import { logger } from "../../logger";
import InstallationService from "./service";

export class InstallationController implements InstallationStore {
  private installationService: InstallationService;

  constructor() {
    this.installationService = new InstallationService();
  }

  async fetchInstallation(
    query: InstallationQuery<boolean>
  ): Promise<Installation<"v1" | "v2", boolean>> {
    try {
      if (query.teamId !== undefined) {
        return this.installationService.get(query.teamId);
      }
    } catch (error) {
      logger.error(error);
    }
    return {} as Installation;
  }

  async storeInstallation<AuthVersion extends "v1" | "v2">(
    installation: Installation<AuthVersion, boolean>
  ): Promise<void> {
    try {
      this.installationService.save(installation);
    } catch (error) {
      logger.error(error);
    }
  }
}
