import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from "@slack/bolt";

import { log } from "../logger";
import { InstallationService } from "./service";

export class InstallationController implements InstallationStore {
  private installationService: InstallationService;

  constructor(installationService: InstallationService) {
    this.installationService = installationService;
  }

  async fetchInstallation(
    query: InstallationQuery<boolean>
  ): Promise<Installation<"v1" | "v2", boolean>> {
    try {
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        return this.installationService.get(query.enterpriseId);
      }
      if (query.teamId !== undefined) {
        return this.installationService.get(query.teamId);
      }
    } catch (error) {
      log.error(error);
    }
    return {} as Installation;
  }

  async storeInstallation<AuthVersion extends "v1" | "v2">(
    installation: Installation<AuthVersion, boolean>
  ): Promise<void> {
    try {
      if (installation.isEnterpriseInstall && installation.enterprise?.id) {
        return this.installationService.save(
          installation.enterprise.id,
          installation
        );
      }
      if (installation.team?.id !== undefined) {
        return this.installationService.save(
          installation.team.id,
          installation
        );
      }
    } catch (error) {
      log.error(error);
    }
  }

  async deleteInstallation(query: InstallationQuery<boolean>): Promise<void> {
    try {
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        return this.installationService.delete(query.enterpriseId);
      }
      if (query.teamId !== undefined) {
        return this.installationService.delete(query.teamId);
      }
    } catch (error) {
      log.error(error);
    }
  }
}
