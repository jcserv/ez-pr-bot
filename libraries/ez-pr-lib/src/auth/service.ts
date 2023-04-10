import { Installation } from "@slack/bolt";

import { HTTPError } from "../httpError";
import InstallationRepo from "./db";

export interface InstallationService {
  get(id: string): Promise<Installation>;
  save(id: string, installation: Installation): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InstallationServiceImpl implements InstallationService {
  private repo: InstallationRepo;

  constructor(installationRepo: InstallationRepo) {
    this.repo = installationRepo;
  }

  async get(id: string): Promise<Installation> {
    if (id === "") {
      throw new HTTPError(
        400,
        "Unable to retrieve installation - id cannot be empty",
        id
      );
    }

    const result = await this.repo.get(id);
    if (result === undefined) {
      throw new HTTPError(404, "Unable to retrieve installation", id);
    }
    return result;
  }

  async save(id: string, installation: Installation): Promise<void> {
    if (installation.team === undefined) {
      throw new HTTPError(
        400,
        "Unable to save installation - team cannot be undefined"
      );
    }
    await this.repo.save(id, installation);
  }

  async delete(id: string): Promise<void> {
    if (id === "") {
      throw new HTTPError(
        400,
        "Unable to delete installation - id cannot be empty",
        id
      );
    }
    await this.repo.delete(id);
  }
}
