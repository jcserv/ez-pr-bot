import { Handler } from "aws-lambda";
import crypto from "crypto";
import dotenv from "dotenv";
import { log } from "ez-pr-lib";
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

    const installationOctokit = await app.getInstallationOctokit(
      installAuth.data.id
    );

    const res = await installationOctokit.request("GET /search/issues", {
      q: "is:pr author:jcserv archived:false",
    });

    const response = {
      statusCode: 200,
      body: JSON.stringify(res.data),
    };

    return response;
  } catch (err) {
    log.error(err);
    return {
      statusCode: 500,
    };
  }
};
