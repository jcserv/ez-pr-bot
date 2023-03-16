import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.REGION;

const ddbClient = new DynamoDBClient({ region: REGION });

export function destroyDDBClient() {
  ddbDocClient.destroy();
  ddbClient.destroy();
}

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
