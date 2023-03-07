import {
  App,
  AppOptions,
  Authorize,
  AwsLambdaReceiver,
  ExpressReceiver,
  ExpressReceiverOptions,
  FileInstallationStore,
  InstallationStore,
  LogLevel,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

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

class BaseConfig {
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
    this.installationStore = new FileInstallationStore(); // InstallationController();
  }
}

class BaseAppConfig extends BaseConfig implements AppOptions {
  receiver: AwsLambdaReceiver;
  processBeforeResponse: boolean;
  authorize: Authorize<boolean>;

  constructor(receiver: AwsLambdaReceiver) {
    super();
    this.receiver = receiver;
    this.processBeforeResponse = true;
    this.authorize = async (query) => {
      console.log(await this.installationStore.fetchInstallation(query));
      return this.installationStore.fetchInstallation(query);
    };
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

class BaseExpressReceiverConfig
  extends BaseConfig
  implements ExpressReceiverOptions {}

export class ExpressReceiverFactory {
  private config: ExpressReceiverOptions;

  constructor() {
    this.config = new BaseExpressReceiverConfig();
  }

  build(): ExpressReceiver {
    return new ExpressReceiver(this.config);
  }
}
