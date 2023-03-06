import { Installation } from "@slack/bolt";

import { HTTPError } from "../../errors";
import InstallationRepo from "./db";

export default class InstallationService {
  private repo: InstallationRepo;

  constructor() {
    this.repo = new InstallationRepo();
  }

  get(id: string): Installation {
    if (id === "") {
      throw new HTTPError(
        400,
        "Unable to retrieve installation - id cannot be empty",
        id
      );
    }
    return this.repo.get(id);
  }

  save(installation: Installation): void {
    if (installation.team === undefined) {
      throw new HTTPError(
        400,
        "Unable to save installation - team cannot be empty"
      );
    }
    this.repo.save(installation);
  }
}
