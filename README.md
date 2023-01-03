# 🤖 ez-pr-bot

EZ PR Bot is a Slack bot that accelerates the PR review process for your team!

## 🤔 Why

Getting your code changes reviewed can be more laborious than it should be.

EZ PR Bot solves this by encapsulating the entire code PR review workflow into a simple shortcut, that makes them actionable and trackable.

## 📁 Project Structure

```text
.
├── src
│   ├── cmd                         # Implementation of slash commands is done using the Command pattern [4]
│   │    ├── <cmd> 
│   │    │   ├── blocks.ts          # Markdown/block definitions that the command renders in Slack
│   │    │   └── index.ts           # Implementation of commands. Should contain a Command class with a constructor & handler
│   │    ├── index.ts               # Exports the <cmd> subpackages for simplication of import stmts
│   │    └── interface.ts           # The base Command interface
│   ├── errors                      # Error classes to communicate issues to users
│   ├── types                       # Contains various relevant type declarations and zod parsing schemas
│   ├── app.ts                      # Slack Command/Action handlers
│   └── parse.ts                    # Parsing utility functions
└── README.md                       # You are here! :)
```

## 💡 Contributing

We welcome all contributions! If you identify any bugs or have an idea for a feature request, please create a Github issue and verify that it does not exist already.

EZ PR Bot follows trunk-based development.

```
──────────────────────── main ────────────────────────────────────    # Deployments
        │                                   │
        └───────────── feat/[feat-name] ────                          # Dev branches
```

Dev branches should be appended with an indicator to describe the type of work being done, 
including but not limited to: feat, fix, refactor, tweak, docs, chore

For internal team:
1. Clone the repo
2. See featurework

For open source contributors:
1. Fork the repo
2. `git remote add upstream https://github.com/jcserv/ez-pr-bot/`
3. `git fetch upstream`
4. `git rebase upstream/develop`
5. See featurework

## ⛏️ Featurework:

1. `git checkout -b <type>/[name]`
2. Write your code
3. Open a PR from that branch to main
4. Fill out the pull request template accordingly
5. To be approved, code must have adequate test coverage + formatted properly
6. Commits should be squashed when merged

## 💼 Local Development

### Running Locally 

Create a .env file in the root directory:
```
SLACK_APP_TOKEN=[YOUR APP TOKEN HERE]
SLACK_BOT_TOKEN=[YOUR BOT TOKEN HERE]
```

Locally running:
1. `yarn`               
2. `yarn dev`

## Future Extensions

See our Github projects for an updated look at our planned/upcoming work, but here's our planned roadmap.

```text
.
├── V0.5.0 - CLI
│   ├── /help     
│   ├── /ezpr
│   ├── delete pr review request
│   └── /statistics: view stats for your PRs/your team's PRs e.g. time-to-merge, time-to-approve, actual-review-time                      
├── V1.0.0 - Interactivity via UI
|   ├── Forms/modals for easier use of /help, /ezpr, etc.
|   ├── Shortcuts compatibility
│   ├── /assign: assign reviewers to your PR or randomly choose from a role
│   ├── /reminders: send reminders to assigned reviewers if PR still open after X time or next work day
│   └── /openprs: view a list of open prs that require your review
├── V2.0.0 - TBD
└── README.md                       # You are here! :)
```

Some other ideas still under evaluation:

- Urgency: Communicate to reviewers that this PR is urgent, maybe itll dm the team?
- If 5 mins ETR selected —> assign reviewer(s) —> DM reviewer(s)
- Github integration: inform that PR needs re-review after changes are pushed

## ✍️ Contributors <a name = "authors"></a>
- [@jcserv](https://jarrodservilla.com)

## 📚 References

- https://github.com/glamboyosa/PRBot
- https://www.upsilonit.com/blog/create-a-slack-bot-with-typescript-in-3-steps#step-1-initial-slack-bot-setup
- https://www.freecodecamp.org/news/how-to-build-a-basic-slackbot-a-beginners-guide-6b40507db5c5/
- https://refactoring.guru/design-patterns/command

## 🏁 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.