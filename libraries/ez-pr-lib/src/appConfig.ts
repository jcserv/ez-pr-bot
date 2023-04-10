import { InstallationStore } from "@slack/bolt";

import { InstallationController } from "./auth";
import DynamoInstallationRepo from "./auth/db";
import { InstallationServiceImpl } from "./auth/service";

export const scopes = [
  "app_mentions:read",
  "channels:join",
  "channels:history",
  "chat:write",
  "chat:write.public",
  "commands",
  "emoji:read",
  "im:write",
  "reactions:read",
  "reactions:write",
  "users:read",
  "usergroups:read",
  "workflow.steps:execute",
];

export class BaseConfig {
  signingSecret: string;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  scopes: string[];
  installationStore: InstallationStore;
  directInstall: boolean;

  constructor(signingSecret: string, slackClientID: string, slackClientSecret: string, stateSecret: string, tableName: string, region: string) {
    this.signingSecret = signingSecret;
    this.clientId = slackClientID;
    this.clientSecret = slackClientSecret;
    this.stateSecret = stateSecret;
    this.scopes = scopes;

    const installationRepo = new DynamoInstallationRepo(tableName, region);
    const installationService = new InstallationServiceImpl(installationRepo);
    this.installationStore = new InstallationController(installationService);
    this.directInstall = true;
  }
}
