import { WebClient } from "@slack/web-api";

import { ICommand } from "../../types";

export class GetIDsByNamesCommand implements ICommand {
  client: WebClient;
  targetNames: string[];

  constructor(client: WebClient, targetNames: string[]) {
    this.client = client;
    this.targetNames = targetNames;
  }

  async handle() {
    const response = await this.client.users.list();
    const result: string[] = [];
    const remainingNames = this.targetNames;

    response.members?.forEach((member) => {
      if (member.name === undefined || member.id === undefined) {
        return;
      }
      if (remainingNames.includes(member.name)) {
        result.push(member.id);
        remainingNames.splice(remainingNames.indexOf(member.name), 1);
      }
    });

    return result;
  }
}
