import { WebClient } from "@slack/web-api";

import { ICommand, StringArrayDictionary } from "../../types";

export class GetUsersInUserGroupCommand implements ICommand {
  client: WebClient;
  ids: Set<string>;

  constructor(client: WebClient, ids: Set<string>) {
    this.client = client;
    this.ids = ids;
  }

  async handle() {
    const result = new StringArrayDictionary();

    this.ids.forEach(async (id) => {
      const response = await this.client.usergroups.users.list();
      if (id === undefined || response.users === undefined) {
        return;
      }
      result.Entries[id] = response.users;
    });

    return result;
  }
}
