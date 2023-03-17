import { Probot, ApplicationFunctionOptions } from "probot";

export = (app: Probot, { getRouter}: ApplicationFunctionOptions) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  if (!getRouter) return

  const router = getRouter("/my-app");
  // Use any middleware
  router.use(require("express").static("public"));

  // Add a new route
  router.get("/hello-world", (req, res) => {
    res.send("Hello World");
  });
};