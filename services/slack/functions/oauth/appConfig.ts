import { ExpressReceiver, ExpressReceiverOptions } from "@slack/bolt";
import { BaseConfig } from "ez-pr-lib";

class BaseExpressReceiverConfig
  extends BaseConfig
  implements ExpressReceiverOptions {}

export class ExpressReceiverFactory {
  private config: ExpressReceiverOptions;

  constructor() {
    this.config = new BaseExpressReceiverConfig(
      process.env.SIGNING_SECRET || "",
      process.env.SLACK_CLIENT_ID || "",
      process.env.SLACK_CLIENT_SECRET || "",
      process.env.STATE_SECRET || "",
      process.env.DYNAMO_TABLE || "",
      process.env.REGION || ""
    );
  }

  build(): ExpressReceiver {
    return new ExpressReceiver(this.config);
  }
}
