import {
  /* APIGatewayEvent, Callback, Context, */
  Handler,
} from "aws-lambda";
import crypto from "crypto";
import dotenv from "dotenv";
import { App } from "octokit";

dotenv.config();

const privateKeyPkcs8 = crypto
  .createPrivateKey(process.env.PRIVATE_KEY || "")
  .export({
    type: "pkcs8",
    format: "pem",
  });

const app = new App({
  appId: process.env.APP_ID || "",
  privateKey: privateKeyPkcs8.toString(),
});

export const getPrs: Handler = async () => {
  try {
    const installAuth = await app.octokit.request(
      "GET /repos/{owner}/{repo}/installation",
      {
        owner: "jcserv",
        repo: "ez-pr-bot",
      }
    );

    // eslint-disable-next-line no-console
    console.log(installAuth);

    const installationOctokit = await app.getInstallationOctokit(
      installAuth.data.id
    );

    const res = await installationOctokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner: "jcserv",
        repo: "ez-pr-bot",
      }
    );
    // eslint-disable-next-line no-console
    console.log(res);
    return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {};
  }
};
