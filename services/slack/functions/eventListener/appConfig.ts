import {
  App,
  AppOptions,
  Authorize,
  AuthorizeResult,
  LogLevel,
  Receiver,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

import { BaseConfig } from "../../common";

dotenv.config();

class BaseAppConfig extends BaseConfig implements AppOptions {
  receiver: Receiver;
  processBeforeResponse: boolean;
  authorize: Authorize<boolean>;

  constructor(receiver: Receiver) {
    super();
    this.receiver = receiver;
    this.processBeforeResponse = true;
    this.authorize = async (query): Promise<AuthorizeResult> => {
      const installation = await this.installationStore.fetchInstallation(
        query
      );

      const result: AuthorizeResult = {
        botToken: installation.bot?.token,
        botId: installation.bot?.id,
        botUserId: installation.bot?.id,
        userToken: installation.user?.token,
        teamId: installation.team?.id,
        enterpriseId: installation.enterprise?.id,
      };

      return result;
    };
  }
}

class ProdConfig extends BaseAppConfig {}
class DevConfig extends BaseAppConfig {
  logLevel: LogLevel;

  constructor(receiver: Receiver) {
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

  constructor(receiver: Receiver) {
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
