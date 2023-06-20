# [Tech Matome](https://techmatome.com/)
Tech curation news platform for Japanese audiences

<icon>📱</icon>

## Context of this project
I used to use news sites and Twitter to catch up with the latest news, but I always felt overwhelmed and tired due to being distracted by small details, unrelated news, and conversations. 

Subscribing to newsletters helped me to some extent, but there were still a few things I didn't like:

- They didn't provide enough information that I as a developer wanted to catch up on.
- They often led me to click on the article itself, even when I just wanted a brief overview.

So, I decided to create an automated curation system that summarises the latest news that I want to consume. 

This was just the beginning, and I came up with the idea to translate those news articles into Japanese. This way, I can cater to Japanese audiences while leveraging the time difference between Japan and Ireland.

## Functionalities included in this repo

- Subscribe to the newsletter with email address
- Verify email address by email receipt
- Sending automated emails (Email address verification, welcome email and daily bulk send newsletters)
- Update subscription range
- Automatically generate email template from markdown files

## Technology used

**Frontend:** Typescript, Next.js, TailwindCSS

**Backend:** Typescript, Node.js, [Xata](https://xata.io/)

**Test:** [Vitest](https://vitest.dev/)

**Infrastructures:** AWS Lambda, API Gateway, S3, EventBus, SNS and SES

**Infra management:** Cloudformation developed with [SST framework](https://sst.dev/)

