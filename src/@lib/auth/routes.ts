import { workspaceInstallHtml } from "./html";

export const customRoutes = [
  {
    method: ["GET"],
    path: "/slack/install/workspace",
    handler: (_: any, res: any) => {
      res.writeHead(200);
      res.end(workspaceInstallHtml);
    },
  },
];

module.exports = { customRoutes };
