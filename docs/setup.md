# Local Development

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#base-installation">Base Installation</a>
    </li>
    <li>
      <a href="#socket-mode">Socket Mode</a>
      <ul>
        <li><a href="#socket-installation">Installation</a></li>
        <li><a href="#socket-locally-running">Locally Running</a></li>
      </ul>
    </li>
    <li>
      <a href="#http-mode">HTTP Mode</a>
      <ul>
        <li><a href="#http-installation">Installation</a></li>
        <li><a href="#http-locally-running">Locally Running</a></li>
      </ul>
    </li>
    <li>
      <a href="#testing">Testing</a>
    </li>
    <li>
      <a href="#debugger">Debugger</a>
    </li>
  </ol>
</details>

---------------

## Base Installation 

1. Install codebase

    a. **Internal contributors:** `git clone git@github.com:jcserv/ez-pr-bot.git`

    b. **Open source contributors:**

        i. Fork the repo
        ii. `git remote add upstream https://github.com/jcserv/ez-pr-bot/`
        iii. `git fetch upstream`
        iv. `git rebase upstream/main`

2. Create a .env file in the root directory:
```
NODE_ENV=development
SLACK_BOT_TOKEN=[YOUR BOT TOKEN HERE]
USER_ID=[YOUR USER_ID HERE] # Used to publish the home view on app startup
```
3. [Create a Slack Workspace](https://slack.com/get-started#/create)
4. [Create a Slack App and install it to your workspace](https://api.slack.com/authentication/basics)
5. Run `yarn` to install dependencies 

---------------

## Socket Mode

Socket Mode is a protocol where it allows your app to use the Events API and interactive components of the platform—without exposing a public HTTP Request URL. This is the recommended way to run EZ PR Bot while locally developing. Apps cannot be in Socket Mode when published to the App Directory.

### <p id="socket-installation">Installation</p>

1. Add the following environment variables to your .env
```
SLACK_APP_TOKEN=[YOUR APP TOKEN HERE]
```
2. Navigate to your Slack App and configure it to Socket Mode

    a. **[Method 1: Configure via Settings UI]** Settings -> Socket Mode -> Connect using Socket Mode -> Enable Socket Mode

    b. **[Method 2: Manifest]** Copy the <a href="#socket-manifest">below manifest.yml</a>, navigate to Features -> App Manifest, overwrite your app configuration, then save.


<details id="socket-manifest" open="open">
 <summary>Socket Mode `manifest.yml`</summary>

 ```yaml
display_information:
  name: EZ PR Bot DEV
  description: A Slack bot that accelerates your team's PR review process
  background_color: "#586da6"
features:
  app_home:
    home_tab_enabled: true
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: EZ PR Bot DEV
    always_online: true
  shortcuts:
    - name: Submit PR Review Request
      type: global
      callback_id: open_ezpr_modal
      description: Submit a pull request for review to the specified channel, which will ping the provided mentions.
  slash_commands:
    - command: /ezpr
      description: Submit a pull request for review to the specified channel, which will ping the provided mentions.
      usage_hint: "[link] [time] [desc] [@role] [#channel]"
      should_escape: false
    - command: /help
      description: Provides information about EZ PR Bot, the commands available, and their usage.
      usage_hint: "[topic]"
      should_escape: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:join
      - chat:write
      - chat:write.public
      - commands
      - emoji:read
      - im:write
      - reactions:read
      - reactions:write
      - workflow.steps:execute
      - users:read
      - channels:history
settings:
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```
</details>

<br/>

### <p id="socket-locally-running">Locally Running</p>

Run `yarn dev`

---------------

## HTTP Mode

(aka "events api over http" mode)

Our Slack App receives HTTP requests from Slack when events our app has subscribed to occurs.
The production environment is deployed using AWS Lambda. 

### <p id="http-installation">Installation</p>

1. Add the following environment variables to your .env
```
SLACK_SIGNING_SECRET=[YOUR APP SIGNING SECRET HERE]
```
2. Install [serverless](https://www.serverless.com/framework/docs/getting-started) and [ngrok](https://ngrok.com/download)
3. Navigate to your Slack App and configure it to communicate via Request URLs

    a. **[Method 1: Configure via Settings UI]**  
    
      - i. (Disable Socket Mode) Settings -> Socket Mode -> Connect using Socket Mode -> Disable Socket Mode

      - ii. (Configure Request URLs) Navigate to each feature (Interactivity, Slash Commands). Paste your ngrok url and append it with /slack/events ex: `[YOUR-NGROK-URL-HERE]/slack/events`  

    b. **[Method 2: Manifest]** Copy the <a href="#http-manifest">below manifest.yml</a>, navigate to Features -> App Manifest, overwrite your app configuration, then save.

<details open="open">
 <summary>HTTP Mode `manifest.yml`</summary>

  ```yaml
display_information:
  name: EZ PR Bot
  description: A Slack bot that accelerates your team's PR review process
  background_color: "#586da6"
features:
  app_home:
    home_tab_enabled: true
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: EZ PR Bot
    always_online: true
  shortcuts:
    - name: Submit PR Review Request
      type: global
      callback_id: open_ezpr_modal
      description: Submit a pull request for review to the specified channel, which will ping the provided mentions.
  slash_commands:
    - command: /ezpr
      url: [YOUR-NGROK-URL-HERE]/slack/events
      description: Submit a pull request for review to the specified channel, which will ping the provided mentions.
      usage_hint: "[link] [time] [desc] [@role] [#channel]"
      should_escape: false
    - command: /help
      url: [YOUR-NGROK-URL-HERE]/slack/events
      description: Provides information about EZ PR Bot, the commands available, and their usage.
      usage_hint: "[topic]"
      should_escape: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:join
      - chat:write
      - chat:write.public
      - commands
      - emoji:read
      - im:write
      - reactions:read
      - reactions:write
      - workflow.steps:execute
      - users:read
      - channels:history
settings:
  interactivity:
    is_enabled: true
    request_url: [YOUR-NGROK-URL-HERE]/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```
</details>

<br/>

### <p id="http-locally-running">Locally Running</p>

1. `yarn dev lambda`
2. `yarn serve local`
3. Update the Request URLs of the application with your ngrok generated URL

## Running Tests

Run `yarn test`.

You should see the following output in the CLI

```
yarn run v1.22.17
$ jest
 PASS  src/types/model.test.ts
 PASS  src/parse/index.test.ts

Test Suites: 2 passed, 2 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        0.691 s
Ran all test suites.
✨  Done in 1.41s.
```

## Debugger

VSCode:

1. `mkdir .vscode`
2. `cd ./.vscode`
3. `touch launch.json`
4. Copy and paste the following json

<details open="open">
 <summary>.vscode/launch.json</summary>

  ```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "Build Project",
        "program": "${workspaceFolder}/src/app.ts",
        "preLaunchTask": "npm: build",
        "sourceMaps": true,
        "smartStep": true,
        "internalConsoleOptions": "openOnSessionStart",
        "outFiles": ["${workspaceFolder}/**/*.js"]
      },
      {
        "type": "node",
        "request": "launch",
        "name": "Jest Current File",
        "program": "${workspaceFolder}/node_modules/.bin/jest",
        "args": ["${relativeFile}"],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen",
        "windows": {
          "program": "${workspaceFolder}/node_modules/jest/bin/jest"
        }
      }
   ]
}
```
</details>