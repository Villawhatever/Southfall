# Southfall
A rudimentary Slack slash command to query the Comprehensive Rules

# How do I use this?
Install it [here](https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=20174627574.553569614352), then, for example:
/cr 104.3a
/cr 702.136 702.136a

Note that multiple simultaneous rules queries are **space-delimited**. If at least one of the requested rules is valid, you'll get it in the channel from which you requested. If none of them are valid, you'll get a visible-only-to-you error.

Also, before you ask, as of right now custom slash commands _cannot_ work in threads. I have asked Slack directly. :(

# If you have problems
I would _hugely_ prefer you open an Issue on Github. If you are unwilling or unable to do so, please e-mail me directly at andrew@primefour.com

# Privacy stuff
I do literally nothing with data except use it to hopefully hunt down reported bugs. Nothing is saved.
