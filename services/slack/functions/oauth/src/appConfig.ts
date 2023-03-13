import { ExpressReceiver, ExpressReceiverOptions } from "@slack/bolt";
import dotenv from "dotenv";

import { BaseConfig } from "../../../../../libs/slackAppConfig";

dotenv.config();

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
