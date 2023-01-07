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

const ezprBaseExampleUsage =
  "`/ezpr [pr link] [estimated review time] [description]`";
const ezprDefaultChannelExampleUsage =
  "`/ezpr [pr link] [estimated review time] [description] [@role]`";
const ezprAllArgsExampleUsage =
  "`/ezpr [pr link] [estimated review time] [description] [@role] [#channel]`";

const helpUsageMarkdown = `
> /help usage

EZ PR Bot :robot_face: is a tool for managing pull request reviews for software development teams.

*usage*: 

  \`/<command> [arguments]\`

The commands are:

  ezpr    submit a pull request for review
  config  get and set (team/individual) options
  help    receive information about how to use EZ PR Bot and other commands

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

	${ezprAllArgsExampleUsage}
     ${ezprDefaultChannelExampleUsage}
	${ezprBaseExampleUsage}

*description*: You can submit a pull request for review to the specified channel, which will ping the provided mention.
If [@role] is not provided, the message does not ping.
If [#team-channel] is not provided, it defaults to the posted channel.

*arguments*:

	[pr link] url string *required*
    A URL link to the pull request
		ex. http://github.com/jcserv/ez-pr-bot/pulls/1

	[estimated review time] string *required*
    How long it should take to review this PR. Should end with minutes ("m", "min", "minutes") or hours ("h", "hrs", "hours")
		ex. 15m, 2hrs, "75 minutes"

	[description] string *required*
    A summary of the changes. Should be wrapped with quotes (")
		ex. "Adds the help command allowing users to learn how to use the bot"	

	[@role] @string 
    The role to mention, whom should review the PR.
		ex. @ez-pr-devs

  [#team-channel] #string 
    A Slack channel that EZ PR Bot has joined
		ex. #team-ez-pr-bot  

*example usage*:

	*input:* \`/ezpr http://github.com/jcserv/ez-pr-bot/pulls/1 15m "Adds the help command allowing users to learn how to use the bot" @ez-pr-devs #team-ez-pr-bot\`
	
	*effect:* Sends a formatted Slack message to #team-ez-pr-bot that pings the @ez-pr-devs role, containing the pull request link, the estimated review time, and the description provided by the user.
`;

const configTeamsUsage = "`/config teams`";
const configCreateTeamUsage = "`/config --team [team-key]`";
const configSetTeamUsage =
  "`/config --team [team-key] [#team-channel] [@role]`";
const configSetTeamChannelUsage =
  "`/config --team [team-key] --channel [#team-channel]`";
const configSetTeamRoleUsage = "`/config --team [team-key] --role [@role]`";

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

	${configTeamsUsage}
    Returns a list of teams registered with EZ PR Bot.

	${configCreateTeamUsage}
    Create a new team. If it exists, returns the settings for that team.

  ${configSetTeamUsage}
    Specify the #channel and @role for pull request reviews for the team.

  ${configSetTeamChannelUsage}
    Sets the #channel for the team to the provided value. Must be a Slack channel.

  ${configSetTeamRoleUsage}
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
