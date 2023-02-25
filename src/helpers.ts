export function formatNItems(items: string[]): string {
  if (items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return items.join(" and ");
  }
  return (
    items.slice(0, items.length - 1).join(", ") +
    ", and " +
    items[items.length - 1]
  );
}
