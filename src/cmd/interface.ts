export interface ICommand {
  input?: string;
  handle(): any;
}
