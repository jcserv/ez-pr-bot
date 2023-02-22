> /help stats

usage: 

	/stats							# View your average statistics as a contributor
	/stats —channel [#channel]		# View the average statistics of a channel
	/stats —pr [pr url]				# View the average statistics of a pull request
	/stats —pr [pr ID]				#
	/stats —aggregate [aggregate]	# Specify the aggregate functions being applied when calculating statistics


description: View interesting stats about PR review requests submitted by yourself or submitted in a provided channel.

options:

	—channel
		Used to define scope for the statistics calculation to the provided channel(s)

	—pr
		Used to define scope for the statistics calculation to the provided PR.

	—aggregate
		Used to determine what aggregate function will be run on the statistics.
	

arguments:

	[#channel] - A valid Slack channel that ez pr bot has submitted PR review requests to
		ex. #team-ez-pr-bot

	[pr URL] - A link to the pull request
		ex. https://github.com/jcserv/ez-pr-bot/pulls/1

	[pr ID] - A unique identifier for the pull request. Can be retrieved using /prs

	[aggregate] - The aggregate function(s) to calculate the statistics of. Should be comma-separated. Case insensitive.
		One of [“AVG”, “MIN”, “MAX”, “MEDIAN”, “ALL”].
		ex. AVG, ALL, “AVG,MIN”

example usage:

*input:* `/stats`

*output*:

> Here are your AVG statistics as a contributor:
| Type | Statistic             | Value |
|------|-----------------------|-------|
| AVG  | Time-to-Merge         | 2h30m |
| AVG  | Time-to-Approve       | 1h10m |
| AVG  | Actual Review Time    | 20m   |
| AVG  | Estimated Review Time | 30m   |

*input:* `/stats —channel #team-ez-pr-bot`

*output*:

> Here are the AVG statistics for the channel #ez-pr-bot:

| Type | Statistic             | Value |
|------|-----------------------|-------|
| AVG  | Time-to-Merge         | 2h30m |
| AVG  | Time-to-Approve       | 1h10m |
| AVG  | Actual Review Time    | 20m   |
| AVG  | Estimated Review Time | 30m   |

*input:* `/stats —pr http://github.com/jcserv/ez-pr-bot/pulls/1`

*output*:

> Here are the AVG statistics for the pull request http://github.com/jcserv/ez-pr-bot/pulls/1:

| Type | Statistic             | Value |
|------|-----------------------|-------|
| AVG  | Time-to-Merge         | 2h30m |
| AVG  | Time-to-Approve       | 1h10m |
| AVG  | Actual Review Time    | 20m   |
| AVG  | Estimated Review Time | 30m   |

*input:* `/stats —aggregate MIN`

*output*:

> Here are your MIN statistics as a contributor:

| Type | Statistic             | Value |
|------|-----------------------|-------|
| MIN  | Time-to-Merge         | 20m |
| MIN  | Time-to-Approve       | 1h1m |
| MIN  | Actual Review Time    | 2m   |
| MIN  | Estimated Review Time | 5m   |

*input:* `/stats —aggregate AVG,MIN`

*output*:

> Here are your AVG and MIN statistics as a contributor:
| Type | Statistic             | Value |
|------|-----------------------|-------|
| MIN  | Time-to-Merge         | 20m |
| MIN  | Time-to-Approve       | 1h1m |
| MIN  | Actual Review Time    | 2m   |
| MIN  | Estimated Review Time | 5m   |
| AVG  | Time-to-Merge         | 2h30m |
| AVG  | Time-to-Approve       | 1h10m |
| AVG  | Actual Review Time    | 20m   |
| AVG  | Estimated Review Time | 30m   |


