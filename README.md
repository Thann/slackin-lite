# slackin-lite
Simple API to invite users to your slack channel. Similar to "[slackin](https://github.com/rauchg/slackin)" but without all the bullshit.

# Usage
1. Generate a legacy API token on an admin account [here](https://api.slack.com/custom-integrations/legacy-tokens)
2. Edit server.js to include the proper org_name and api_token
3. Install dependencies `npm install`
4. Start server `node server`
5. Send a POST to the url with email param `curl localhost:3000 -X POST -d "email=someone@domain.tld"`
