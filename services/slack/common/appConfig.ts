import { InstallationStore } from "@slack/bolt";
import dotenv from "dotenv";

import { InstallationController } from "./auth";

dotenv.config();

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

  constructor() {
    this.signingSecret = process.env.SLACK_SIGNING_SECRET || "";
    this.clientId = process.env.SLACK_CLIENT_ID || "";
    this.clientSecret = process.env.SLACK_CLIENT_SECRET || "";
    this.stateSecret = process.env.STATE_SECRET || "";
    this.scopes = scopes;
    this.installationStore = new InstallationController();
  }
}
