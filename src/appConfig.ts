import {
  App,
  AppOptions,
  Authorize,
  AwsLambdaReceiver,
  InstallationStore,
  LogLevel,
} from "@slack/bolt";
import { HTTPReceiverInstallerOptions } from "@slack/bolt/dist/receivers/HTTPReceiver";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

import { InstallationController } from "./@lib";

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
  signingSecret: string;
  clientId: string;
  clientSecret: string;
  stateSecret: string;
  scopes: string[];
  installationStore: InstallationStore;
  installerOptions: HTTPReceiverInstallerOptions;
  authorize: Authorize<boolean>;
  receiver: AwsLambdaReceiver;

  constructor(receiver: AwsLambdaReceiver) {
    const controller = new InstallationController();
    this.signingSecret = process.env.SLACK_SIGNING_SECRET || "";
    this.clientId = process.env.SLACK_CLIENT_ID || "";
    this.clientSecret = process.env.SLACK_CLIENT_SECRET || "";
    this.stateSecret = process.env.STATE_SECRET || "";
    this.scopes = scopes;
    this.installationStore = controller;
    this.installerOptions = {
      stateVerification: true,
    };
    this.authorize = controller.fetchInstallation;
    this.receiver = receiver;
  }
}

class ProdConfig extends BaseAppConfig {}
class DevConfig extends BaseAppConfig {
  logLevel: LogLevel;

  constructor(receiver: AwsLambdaReceiver) {
    super(receiver);
    this.logLevel = LogLevel.DEBUG;
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
        this.config = new DevConfig(receiver);
        break;
      default:
        throw new Error("expected NODE_ENV to be set");
    }
  }

  build(): App<StringIndexed> {
    return new App(this.config);
  }
}
