# slackin-lite
Simple API to invite users to your slack channel. Similar to "[slackin](https://github.com/rauchg/slackin)" but without all the bullshit.

## Usage
1. Generate a legacy API token on an admin account [here](https://api.slack.com/custom-integrations/legacy-tokens)
2. Start server `docker run -d -p "3000:3000" thann/slackin-lite --org <name> --token <token>`
3. Send a POST to the url with email param `curl localhost:3000 -X POST -d "email=someone@domain.tld"`

