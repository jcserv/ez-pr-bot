export interface ICommand {
  input: string;
  handle(): void;
}
