> /ezpr-help set

usage: 

	/set [pr url] [status]			# View your average statistics as a contributor
	/set [pr ID] [status]			# View your average statistics as a contributor

description: Set the status of a PR review request.

arguments:

	[pr URL] - A link to the pull request
		ex. https://github.com/jcserv/ez-pr-bot/pulls/1

	[pr ID] - A unique identifier for the pull request. Can be retrieved using /prs

	[status] - The status to set the PR review request to. Can be one of ["IN_REVIEW", "VIEWED", "CHANGES_REQUESTED", "APPROVED", "MERGE_READY", "MERGED", "CLOSED"]. 
	Case insensitive.
		ex. IN_REVIEW, CLOSED

example usage:

*input:* `/set http://github.com/jcserv/ez-pr-bot/pulls/1 MERGED`

*output:* (message to submitter) The status of the PR review request for http://github.com/jcserv/ez-pr-bot/pulls/1 has been set to MERGED.