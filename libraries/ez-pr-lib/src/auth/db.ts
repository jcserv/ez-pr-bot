import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Installation } from "@slack/bolt";

import { DynamoClient } from "../dynamoClient";
import { log } from "../logger";

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

export default class DynamoInstallationRepo implements InstallationRepo {
  private tableName: string;
  private dynamoClient: DynamoClient;

  constructor(tableName: string, region: string) {
    this.tableName = tableName;
    this.dynamoClient = new DynamoClient(region);
  }

  async get(
    id: string
  ): Promise<Installation<"v1" | "v2", boolean> | undefined> {
    const cmd = new GetCommand({
      TableName: this.tableName,
      Key: { PK: id, SK: InstallationTypes.SLACK },
    });

    try {
      const output = await this.dynamoClient.get().send(cmd);
      const item = output.Item as InstallationItem;
      const result = JSON.parse(item.data);
      const slackInstallation: Installation = {
        ...result,
      };
      return slackInstallation;
    } catch (err) {
      log.error(err);
    } finally {
      this.dynamoClient.destroy();
    }
    return undefined;
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
      await this.dynamoClient.get().send(
        new PutCommand({
          TableName: this.tableName,
          Item,
        })
      );
    } catch (err) {
      log.error(err);
    } finally {
      this.dynamoClient.destroy();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dynamoClient.get().send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: {
            PK: id,
            SK: InstallationTypes.SLACK,
          },
        })
      );
    } catch (err) {
      log.error(err);
    } finally {
      this.dynamoClient.destroy();
    }
  }
}
