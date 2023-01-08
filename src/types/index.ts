export * from "./model";
export * from "./ezpr";
export * from "./help";

export interface Dictionary<T> {
  [Key: string]: T;
}

export class StringDictionary {
  Entries: Dictionary<string> = {};
}
