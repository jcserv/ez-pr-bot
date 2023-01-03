import { EZPRArguments } from "./index";

const ezprMarkdown = (args: EZPRArguments) => `
${args.role} :wave:

*From:* ${args.submitter}

*Estimated Review Time*: ${args.ert}

Please review: ${args.description}

PR Link: ${args.link}
`;

export const ezpr = (args: EZPRArguments) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ezprMarkdown(args),
      },
    },
  ];
};
