export * from "./openModal";
export * from "./postMessage";

export interface ICommand {
  input?: string;
  handle(): any;
}
