import { Installation } from "@slack/bolt";

import { HTTPError } from "../@lib";
import { prisma } from "../client";

export const saveWorkspaceInstallation = async (installation: Installation) => {
  if (installation.team === undefined) {
    throw new HTTPError(400, "installation.team cannot be undefined");
  }
  const id = installation.team.id;

  try {
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

    const resp = await prisma.installation.upsert({
      where: {
        id,
      },
      update: updateRecord,
      create: createRecord,
    });
    return resp;
  } catch (error) {
    return error;
  }
};
