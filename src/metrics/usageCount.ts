import { Dimension } from "@aws-sdk/client-cloudwatch";

import { MetricPublisher, usageNamespace } from ".";

const interactionCountMetricName = "interaction_count";

class InteractionCountMetric extends MetricPublisher {
  constructor(dimensions?: Dimension[]) {
    super(interactionCountMetricName, usageNamespace, dimensions || []);
  }
}

export const createInteractionCountMetric = (
  type: string,
  id: string
): InteractionCountMetric => {
  return new InteractionCountMetric([
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
