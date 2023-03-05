import { PrismaClient } from "@prisma/client";
import { Installation } from "@slack/bolt";

import { HTTPError, logger } from "../..";
import { prismaClient } from "../../prisma";

export default class SlackInstallationStore {
  private client: PrismaClient;

  constructor() {
    this.client = prismaClient;
  }

  async get(id: string): Promise<Installation<"v1" | "v2", boolean>> {
    if (id === undefined || id === "") {
      throw new HTTPError(400, "installation.id cannot be undefined or empty");
    }
    try {
      const installation = await this.client.installation.findUniqueOrThrow({
        where: {
          id,
        },
      });
      console.log(installation);
      return installation as unknown as Installation;
    } catch (error) {
      logger.error(error);
    }
    return {} as Installation;
  }

  async save(installation: Installation): Promise<void> {
    if (installation.team === undefined) {
      throw new HTTPError(400, "installation.team cannot be undefined");
    }
    const id = installation.team.id;

    const updateRecord = {
      team: JSON.stringify({
        id,
        name: installation.team?.name,
      }),
      user: JSON.stringify({
        token: "null",
        scopes: "null",
        id: installation.user.id,
      }),
      bot: JSON.stringify({
        scopes: installation.bot?.scopes,
        token: installation.bot?.token,
        userId: installation.bot?.userId,
        id: installation.bot?.id,
      }),
      enterprise: JSON.stringify({ id: "null", name: "null" }),
      tokenType: installation.tokenType || "",
      isEnterpriseInstall: installation.isEnterpriseInstall || false,
      appId: installation.appId || "",
      authVersion: installation.authVersion || "",
    };

    const createRecord = {
      id,
      ...updateRecord,
    };

    try {
      await this.client.installation.upsert({
        where: {
          id,
        },
        update: updateRecord,
        create: createRecord,
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
