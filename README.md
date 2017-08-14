# BrightReps Zendesk App

Uses Zendesk App Framework v2

## Running Locally

Install Zendesk app tools: https://help.zendesk.com/hc/en-us/articles/229489288

Start the zat server:

    $ zat server

Navigate to https://d3v-brightreps.zendesk.com/agent/tickets/1?zat=true


## Publishing the App

Instructions here: https://developer.zendesk.com/apps/docs/publish/

Notes:

- updated branding and screenshots go in `./src/assets`. See: https://developer.zendesk.com/apps/docs/publish/create_assets
- update `./src/translations/en.json` with app copy
- note that descriptions and installation instructions need to be markdown saved as json text fields. This is prone to errors so we can verify the markdown descriptions renders correctly by running `cd ./scripts && python check_copy.py` and checking the outputted html
- update app version in `./src/manifest.json`
- generate a new zip file of the app by running:

    $ zat package --path=./src

- publish it to the marketplace by uploading the zip file
- tag the release in github