import { createArgsCountMetric } from "./argsCount";
import { createInteractionCountMetric } from "./usageCount";

export function PublishUsageMetrics(
  type: string,
  feature: string,
  numArgs: number
) {
  PublishInteractionCountMetric(type, feature);
  PublishArgsCountMetric(type, feature, numArgs);
}

export function PublishInteractionCountMetric(type: string, feature: string) {
  const interactionCountMetric = createInteractionCountMetric(type, feature);
  interactionCountMetric.publish();
}

export function PublishArgsCountMetric(
  type: string,
  feature: string,
  numArgs: number
) {
  const argsCountMetric = createArgsCountMetric(type, feature);
  argsCountMetric.publish(numArgs);
}
