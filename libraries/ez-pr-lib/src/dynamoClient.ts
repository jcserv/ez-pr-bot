import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoClient {
  private ddbClient: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  constructor(region: string) {
    this.ddbClient = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  get() {
    return this.docClient;
  }

  destroy() {
    this.docClient.destroy();
    this.ddbClient.destroy();
  }
}