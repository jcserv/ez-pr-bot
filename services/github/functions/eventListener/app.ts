import { Context, Probot } from "probot";

export default function handleProbot(app: Probot) {
  app.on("issues.opened", async (context: Context<"issues.opened">) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });
}
