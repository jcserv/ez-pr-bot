import {
  CloudWatchClient,
  CloudWatchClientConfig,
  Dimension,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

import { logger } from "../logger";

export const usageNamespace = "APP/USAGE";

export abstract class MetricPublisher {
  protected metricName: string;
  protected namespace: string;
  protected environment: string;
  protected dimensions: Dimension[];
  protected configuration?: CloudWatchClientConfig;
  private client: CloudWatchClient;

  constructor(
    metricName: string,
    namespace: string,
    dimensions: Dimension[],
    configuration?: CloudWatchClientConfig
  ) {
    this.metricName = metricName;
    this.namespace = namespace;
    this.environment = process.env.NODE_ENV || "";
    this.configuration = configuration;

    const defaultDimension = {
      Name: "Environment",
      Value: this.environment,
    };
    this.dimensions = dimensions?.concat(defaultDimension);
    this.client = new CloudWatchClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  public async publish(count?: number): Promise<void> {
    try {
      logger.info("Publishing metric");
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: this.metricName,
            Dimensions: this.dimensions,
            Unit: "None",
            Timestamp: new Date(),
            Value: count || 1,
          },
        ],
        Namespace: this.namespace,
      });

      await this.client.send(command);
      logger.info("Successfully published metric " + this.metricName);
    } catch (err) {
      logger.error("Failed to publish metric", err);
    }
  }
}

export * from "./usageCount";
