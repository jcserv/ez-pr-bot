import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from "@slack/bolt";

import { logger } from "../../logger";
import InstallationService from "./service";

export class InstallationController implements InstallationStore {
  async fetchInstallation(
    query: InstallationQuery<boolean>
  ): Promise<Installation<"v1" | "v2", boolean>> {
    const installationService = new InstallationService();
    try {
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        return installationService.get(query.enterpriseId);
      }
      if (query.teamId !== undefined) {
        return installationService.get(query.teamId);
      }
    } catch (error) {
      logger.error(error);
    }
    return {} as Installation;
  }

  async storeInstallation<AuthVersion extends "v1" | "v2">(
    installation: Installation<AuthVersion, boolean>
  ): Promise<void> {
    const installationService = new InstallationService();
    try {
      installationService.save(installation);
    } catch (error) {
      logger.error(error);
    }
  }
}
