import { EZPRArguments } from ".";

const ezprMarkdown = (args: EZPRArguments) => `
${args.reviewers?.length === 0 ? "" : args.reviewers?.join(" ")}
*From:* ${args.submitter}
${args.ert === "" ? "" : `\n*Estimated Review Time*: ${args.ert}\n`}
${args.description === "" ? "" : `\nPlease review: ${args.description}\n`}
PR Link: ${args.pullRequest.link}
`;

export const ezprMessage = (args: EZPRArguments) => [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: ":rocket: PR Review Request",
      emoji: true,
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ezprMarkdown(args),
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "View",
        },
        style: "primary",
        url: `${args.pullRequest.link}`,
      },
    ],
  },
  {
    type: "divider",
  },
];

export const ezprText = (args: EZPRArguments) =>
  `A PR Review Request was submitted to ${args.channel}${
    args.ert === "" ? "" : ` with an estimated review time of ${args.ert}`
  }${args.description === "" ? "" : ` | ${args.description}`}`;
