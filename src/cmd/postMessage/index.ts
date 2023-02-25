import { WebClient } from "@slack/web-api";

import { ICommand, UserID, UserIDSchema } from "../../types";

export class PostMessageCommand implements ICommand {
  client: WebClient;
  user_id: UserID;

  constructor(client: WebClient, user_id: string) {
    this.client = client;
    UserIDSchema.parse(user_id);
    this.user_id = user_id;
  }

  async handle() {
    //   await this.client.chat
    //     .postMessage({
    //       blocks: this.message,
    //       channel: this.channel,
    //       text: this.text,
    //     })
    //     .catch((error) => {
    //       throw error;
    //     });
  }
}
