import { EZPRArguments } from "../../types";

const ezprMarkdown = (args: EZPRArguments) => `
${args.role} :wave:

*From:* ${args.submitter}

*Estimated Review Time*: ${args.ert}

Please review: ${args.description}

PR Link: ${args.link}
`;

export const ezprMessage = (args: EZPRArguments) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ezprMarkdown(args),
    },
  },
];
