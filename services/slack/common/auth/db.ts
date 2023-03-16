import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Installation } from "@slack/bolt";
import dotenv from "dotenv";

import { ddbDocClient, destroyDDBClient } from "../dynamoClient";
import { log } from "../logger";

dotenv.config();

enum InstallationTypes {
  SLACK = "SLACK",
}

declare type InstallationItem = {
  PK: string;
  SK: string;
  id: string;
  type: InstallationTypes;
  data: string;
  updated_at: string;
};

export interface InstallationRepo {
  get(id: string): Promise<Installation<"v1" | "v2", boolean> | undefined>;
  save(id: string, installation: Installation): Promise<void>;
  delete(id: string): Promise<void>;
}

const TableName = process.env.AUTH_TABLE || "ez-pr-bot-users";

export default class DynamoInstallationRepo implements InstallationRepo {
  async get(
    id: string
  ): Promise<Installation<"v1" | "v2", boolean> | undefined> {
    const cmd = new GetCommand({
      TableName,
      Key: { PK: id, SK: InstallationTypes.SLACK },
    });

    try {
      const output = await ddbDocClient.send(cmd);
      const item = output.Item as InstallationItem;
      const result = JSON.parse(item.data);
      const slackInstallation: Installation = {
        ...result,
      };
      return slackInstallation;
    } catch (err) {
      log.error(err);
    } finally {
      destroyDDBClient();
    }
  }

  async save(id: string, installation: Installation): Promise<void> {
    const Item: InstallationItem = {
      PK: id,
      SK: InstallationTypes.SLACK,
      id,
      type: InstallationTypes.SLACK,
      data: JSON.stringify(installation),
      updated_at: new Date().toISOString(),
    };

    try {
      await ddbDocClient.send(
        new PutCommand({
          TableName,
          Item,
        })
      );
    } catch (err) {
      log.error(err);
    } finally {
      destroyDDBClient();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName,
          Key: {
            PK: id,
            SK: InstallationTypes.SLACK,
          },
        })
      );
    } catch (err) {
      log.error(err);
    } finally {
      destroyDDBClient();
    }
  }
}
