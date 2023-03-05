import { App, AppOptions, AwsLambdaReceiver, CustomRoute } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

import { customRoutes, InstallationController } from "./@lib";

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

class BaseAppConfig implements AppOptions {
  appToken: string;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  customRoutes: CustomRoute[];
  scopes: string[];
  installationStore: InstallationController;

  constructor() {
    this.appToken = process.env.SLACK_APP_TOKEN || "";
    this.clientId = process.env.SLACK_CLIENT_ID || "";
    this.clientSecret = process.env.SLACK_CLIENT_SECRET || "";
    this.stateSecret = process.env.STATE_SECRET || "";
    this.customRoutes = customRoutes;
    this.scopes = scopes;
    this.installationStore = new InstallationController();
  }
}

class ProdConfig extends BaseAppConfig {
  token: string;
  receiver: AwsLambdaReceiver;

  constructor(receiver: AwsLambdaReceiver) {
    super();
    this.token = process.env.SLACK_BOT_TOKEN || "";
    this.receiver = receiver;
  }
}

class DevConfig extends BaseAppConfig {
  socketMode: boolean;

  constructor() {
    super();
    this.socketMode = true;
  }
}

enum Environment {
  PROD = "production",
  DEV = "development",
}

export class AppFactory {
  private config: AppOptions;

  constructor(receiver: AwsLambdaReceiver) {
    const NODE_ENV = process.env.NODE_ENV || "";
    switch (NODE_ENV) {
      case Environment.PROD:
        this.config = new ProdConfig(receiver);
        break;
      case Environment.DEV:
        this.config = new DevConfig();
        break;
      default:
        throw new Error("expected NODE_ENV to be set");
    }
  }

  build(): App<StringIndexed> {
    return new App(this.config);
  }
}
