import { App, Receiver } from "@slack/bolt";

interface EZPRAppOptions {
  environment: string;
  token: string;
  receiver?: Receiver;
}

const PRODUCTION = "production";

export default class EZPRApp extends App {
  constructor({ environment, token, receiver }: EZPRAppOptions = { environment: "", token: ""}) {
    if (environment === PRODUCTION) {
      super({ token, receiver });
    } else {
      const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN || "";
      super({ token, appToken: SLACK_APP_TOKEN, socketMode: true });
    }
  }
}
