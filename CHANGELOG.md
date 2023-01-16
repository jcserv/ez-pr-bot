# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## V[1.0.0] - 2023-01-16

### Added

- AWS Lambda deployments
- Estimated Review Time outputs as a human readable string (thanks @xZestence)

## V[0.3.0] - 2023-01-08

### Added

- Adds UI extensions to EZ PR Bot
  - Home overview
  - Help Modal
  - EZPR Modal/Form Submission

## V[0.2.1] - 2023-01-04

### Bug Fixes

- Fix bug when parsing two sequential quote-wrapped args

## V[0.2.0] - 2023-01-02

### Added

- EZPR command
  - `/ezpr [pr link] [estimated review time] [description]` to send a pr review request to the current channel
  - `/ezpr [pr link] [estimated review time] [description] [#team-channel] [@role]` to send a pr review request to the specified channel pinging the provided role

## V[0.1.0] - 2023-01-01

### Added

- Help command
  - `/help` to view an overview of EZ PR Bot with quick shortcuts
  - `/help usage` to view a detailed overview of all the commands available
  - `/help <command>` to view more information about a specific command
