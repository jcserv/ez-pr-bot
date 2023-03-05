import { PrismaClient } from "@prisma/client";
import { Installation } from "@slack/bolt";

import { logger } from "../..";
import { prismaClient } from "../../prisma";

export interface InstallationRepo {
  get(id: string): Installation;
}

export default class PrismaInstallationRepo implements InstallationRepo {
  private client: PrismaClient;

  constructor() {
    this.client = prismaClient;
  }

  get(id: string) {
    this.client.installation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .then((result) => {
        const slackInstallation: Installation = {
          ...result,
          authVersion: "v2",
          tokenType: "bot",
          bot: JSON.parse(result.bot),
          team: JSON.parse(result.team),
          enterprise: JSON.parse(result.enterprise),
          user: JSON.parse(result.user),
        };
        return slackInstallation;
      })
      .catch((error) => logger.error(error));
    return {} as Installation;
  }

  save(installation: Installation): void {
    if (installation.team === undefined) {
      return;
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

    this.client.installation.upsert({
      where: {
        id,
      },
      update: updateRecord,
      create: createRecord,
    });
  }
}
