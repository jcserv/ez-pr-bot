import { App, AwsLambdaReceiver } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import dotenv from "dotenv";

import { logger } from "./@lib";
import { customRoutes } from "./auth";
import { prisma } from "./client";
import { DEV, INPUT, PROD } from "./constants";
import { registerEZPRListeners } from "./ezpr";
import { PublishHomeOverview, registerHelpListeners } from "./help";
import scopes from "./scopes.json";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const USER_ID = process.env.USER_ID;

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
});

let app: App<StringIndexed>;

switch (NODE_ENV) {
  case PROD:
    app = new App({
      token: SLACK_BOT_TOKEN,
      receiver: awsLambdaReceiver,
    });
    break;
  case DEV:
    app = new App({
      appToken: process.env.SLACK_APP_TOKEN || "",
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
      stateSecret: process.env.STATE_SECRET || "",
      customRoutes,
      scopes,
      socketMode: true,
      installationStore: {
        storeInstallation: async (installation) => {
          // if (
          //   installation.isEnterpriseInstall &&
          //   installation.enterprise !== undefined
          // ) {
          //   return orgAuth.saveUserOrgInstall(installation);
          // }
          if (installation.team !== undefined) {
            return; // workspaceAuth.saveUserWorkspaceInstall(installation);
          }
          throw new Error(
            "Failed saving installation data to installationStore"
          );
        },
        fetchInstallation: async () => {
          // console.log("installQuery: " + installQuery);
          // console.log(installQuery);
          // if (
          //   installQuery.isEnterpriseInstall &&
          //   installQuery.enterpriseId !== undefined
          // ) {
          //   return dbQuery.findUser(installQuery.enterpriseId);
          // }
          // if (installQuery.teamId !== undefined) {
          //   return
          // }
          throw new Error("Failed fetching installation");
        },
      },
    });
    logger.info("Running in development mode");
    break;
  default:
    logger.error("Environment not specified, shutting down.");
    process.exit(1);
}

// No-op acknowledgement
app.action({ action_id: INPUT }, async ({ ack }) => {
  await ack();
});

registerEZPRListeners(app);
registerHelpListeners(app);

/* Start Bolt App */
app
  .start()
  .then(() => {
    logger.info("⚡️ Bolt app is running!");
    // TODO: Should publish on home opened
    if (USER_ID !== "") {
      PublishHomeOverview(app.client);
    }
  })
  .catch((error) => {
    prisma.$disconnect();
    logger.error(error);
    process.exit(1);
  });
