import { WebClient } from "@slack/web-api";
import { ValidationError } from "../../errors";
import { UserID, UserIDSchema } from "../../types";
import { ICommand } from "../interface";

export class GetNameByID implements ICommand {
  client: WebClient;
  user_id: UserID;

  constructor(client: WebClient, user_id: string) {
    this.client = client;
    UserIDSchema.parse(user_id);
    this.user_id = user_id;
  }

  async handle() {
    const result = await this.client.users.info({
      user: this.user_id,
    });

    const unableToFindUserErr = new ValidationError(
      "unable to retrieve user",
      [],
      this.user_id
    );

    if (
      result === undefined ||
      result.user === undefined ||
      result.user.real_name === undefined
    ) {
      throw unableToFindUserErr;
    }

    return result.user.real_name;
  }
}
