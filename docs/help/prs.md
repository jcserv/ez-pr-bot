> /help prs

usage: 

	/prs 							# Lists all of your open PRs
	/prs —channel [channel]			# List all open PRs submitted to the provided channel
	/prs —status [status]
	
description: List all PR review requests opened by yourself or in a channel.

options:

	—channel
		Used to define scope for the list command to the provided channel(s)

	—status
		Used to query for PRs with the provided status.

arguments:

	[channel] - The Slack channel the PR review request was submitted to
		ex. #team-ez-pr-bot

	[status] - The status of the PR review request. Can be one of ["IN_REVIEW", "VIEWED", "CHANGES_REQUESTED", "APPROVED", "MERGE_READY", "MERGED", "CLOSED"]. 
	Multiple statuses can be provided if comma separated. Case insensitive.
		ex. IN_REVIEW, CLOSED


example usage:

*input:* `/prs`

*output*:

Here is a list of all of your open PRs:
| Link                                                               | Status             | PR ID                                |
|--------------------------------------------------------------------|--------------------|--------------------------------------|
| https://github.com/jcserv/ez-pr-bot/pulls/12                       | In Review          | 864c0bc1-94e8-4f6a-bcc4-9c55bfdaae5c |
| https://github.com/kubernetes/kubernetes/pulls/115100              | Ready to Merge     | 8031a269-f56c-4113-8ebc-7d495ab89148 |
| https://github.com/temporalio/temporal/pulls/3812                  | Changes Requested  | b8384a89-8411-49da-9bec-571ac9ce1037 |
| https://github.com/sailpoint-oss/sailpoint-api-guidelines/pulls/12 | Partially Approved | 645d6135-869e-4191-9394-e29acab7ff48 |
	