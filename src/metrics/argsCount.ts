import { Dimension } from "@aws-sdk/client-cloudwatch";

import { MetricPublisher, usageNamespace } from "./publisher";

const argsCountMetricName = "args_count";

class ArgsCountMetric extends MetricPublisher {
  constructor(dimensions?: Dimension[]) {
    super(argsCountMetricName, usageNamespace, dimensions || []);
  }
}

export const createArgsCountMetric = (
  type: string,
  id: string
): ArgsCountMetric => {
  return new ArgsCountMetric([
    {
      Name: "Type",
      Value: type,
    },
    {
      Name: "ID",
      Value: id,
    },
  ]);
};
