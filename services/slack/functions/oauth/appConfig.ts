import { ExpressReceiver, ExpressReceiverOptions } from "@slack/bolt";
import { BaseConfig } from "ez-pr-lib";

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
