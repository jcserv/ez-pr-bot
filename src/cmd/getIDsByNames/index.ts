import { WebClient } from "@slack/web-api";

import { ICommand, StringDictionary } from "../../types";

export class GetIDsByNamesCommand implements ICommand {
  client: WebClient;
  targetNames: Set<string>;

  constructor(client: WebClient, targetNames: Set<string>) {
    this.client = client;
    this.targetNames = targetNames;
  }

  async handle() {
    const response = await this.client.users.list();
    const result = new StringDictionary();
    const remainingNames = this.targetNames;

    response.members?.forEach((member) => {
      if (member.id === undefined || member.name === undefined) {
        return;
      }
      if (remainingNames.has(member.name)) {
        result.Entries[member.name] = member.id;
        remainingNames.delete(member.name);
      }
    });

    return result;
  }
}
