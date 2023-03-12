export interface ICommand {
  input?: string;
  handle(): any;
}

export interface Dictionary<T> {
  [Key: string]: T;
}

export class StringDictionary {
  Entries: Dictionary<string> = {};
}

export class StringArrayDictionary {
  Entries: Dictionary<string[]> = {};
}
