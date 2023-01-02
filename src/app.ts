import { App } from "@slack/bolt";
import { HelpCommand } from "./cmd";

require("dotenv").config();

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const app = new App({
  appToken: SLACK_APP_TOKEN,
  token: SLACK_BOT_TOKEN,
  socketMode: true,
});

app.command("/help", async ({ ack, payload }) => {
  const command = new HelpCommand(ack, payload);
  command.handle();
});

app.start().catch((error) => {
  console.error(error);
  process.exit(1);
});
