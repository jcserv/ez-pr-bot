export const error = (text: string) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `\`/help ${text}\`: unknown help topic. Run \`/help\` or \`/help usage\``,
      },
    },
  ];
};

export const helpOverview = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Howdy, I'm EZ PR Bot :robot_face: - the Slack bot that accelerates your team's PR review process! :zap:",
    },
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Getting Started*\n Click one of the below shortcuts, or use the basic command \n`/ezpr [#channel] [@role] [pr link] [estimated review time] [description]`\nto submit your PR for review! :rocket:",
    },
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      text: "*Quick Shortcuts*",
      type: "mrkdwn",
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "PR Review Request",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "actionId-0",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Settings Configuration",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "actionId-1",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "More Help",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "actionId-2",
      },
    ],
  },
];

const helpUsageMarkdown = `
> /help usage

EZ PR Bot :robot_face: is a tool for managing pull request reviews for software development teams.

*usage*: 

  \`/<command> [arguments]\`

The commands are:

  ezpr    submit a pull request for review
  config  get and set (team/individual) options

Use \`/help <command>\` for more information about a command.
`;

export const helpUsage = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: helpUsageMarkdown,
    },
  },
  {
    type: "divider",
  },
];

const ezprHelpMarkdown = `
> /help ezpr

*usage*: 

	\`/ezpr [pr link] [estimated review time] [description] [#team-channel] [@role] \`
	\`/ezpr [pr link] [estimated review time] [description]\` (*requires team setup via /config*)

*description*: You can submit a pull request for review to the specified channel, which will ping the provided mention.

*arguments*:

	[pr link] url string <span style="color:red">required</span>
    A URL link to the pull request
		ex. http://github.com/jcserv/ez-pr-bot/pulls/1

	[estimated review time] string <span style="color:red">required</span>
    How long it should take to review this PR. Should end with minutes ("m", "min", "minutes") or hours ("h", "hrs", "hours")
		ex. 15m, 2hrs, "75 minutes"

	[description] string <span style="color:red">required</span>
    A summary of the changes. Should be wrapped with quotes (")
		ex. "Adds the help command allowing users to learn how to use the bot"	

  [#team-channel] #string 
    A Slack channel that EZ PR Bot has joined
		ex. #team-ez-pr-bot

	[@role] @string 
    The role to mention, whom should review the PR.
		ex. @ez-pr-devs

*example usage*:

	*input:* \`/ezpr http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Adds the help command allowing users to learn how to use the bot" #team-ez-pr-bot @ez-pr-devs \`
	
	*effect:* Sends a formatted Slack message to #team-ez-pr-bot that pings the @ez-pr-devs role, containing the pull request link, the estimated review time, and the description provided by the user.
`;

export const ezprHelp = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ezprHelpMarkdown,
    },
  },
  {
    type: "divider",
  },
];

const configHelpMarkdown = `
> /help config

*usage*: 

  > teams

	\`/config teams\`
    Returns a list of teams registered with EZ PR Bot.

	\`/config --team [team-key]\`
    Create a new team. If it exists, returns the settings for that team.

  \`/config --team [team-key] [#team-channel] [@role]\`
    Specify the #channel and @role for pull request reviews for the team.

  \`/config --team [team-key] --channel [#team-channel]\`
    Sets the #channel for the team to the provided value. Must be a Slack channel.

  \`/config --team [team-key] --role [@role]\`
    Sets the @role for the team to the provided value. Must be a Slack role.

*description*: You can get/set configuration options for your team, including where pull request reviews from team members belonging to the provided role are sent.

*options:*

  --team
    Read/write configuration options at the teams level.

*arguments*:

  teams - Returns a list of all registered teams.

	[team-key] string
    A unique String identifier for your team
		ex. "team-ez-pr-bot"

  [#team-channel] #string
    A Slack channel that EZ PR Bot has joined
		ex. #team-ez-pr-bot

	[@role] @string
    The role to mention, whom should review the PR.
		ex. @ez-pr-devs

*example usage*:

Set up your team's EZ PR Bot configuration, which makes future PR review submissions easier!

	\`/config --team ez-pr-devs\`
	\`/config --team ez-pr-devs #team-ez-pr-bot @ez-pr-devs\`
	\`/ezpr http://github.com/jcserv/ez-pr-bot/pulls/3 15m "Bug fix for /help command"\`
`;

export const configHelp = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: configHelpMarkdown,
    },
  },
  {
    type: "divider",
  },
];
