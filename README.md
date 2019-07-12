## Description

Facebook Chat bot using [Nest](https://github.com/nestjs/nest) framework TypeScript.

## Prerequisite

- Npm
- NodeJs version 9+
- Server ready and deployed
- Facebook app for messenger ready
	- Get the page access token for the target page
	- Verify webhook token with `testBot_verify_token>`
	- Allow webhook event for `messages, messaging_postbacks, messaging_optins, message_deliveries`
	- Register `PAGE_ACCESS_TOKEN` in server environment variable

## Run
`npm run postinstall && npm run start`