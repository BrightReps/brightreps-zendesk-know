# BrightReps Zendesk App

Uses Zendesk App Framework v2

## Running Locally

Install Zendesk app tools: https://help.zendesk.com/hc/en-us/articles/229489288

Start the zat server:

    $ zat server

Navigate to https://d3v-brightreps.zendesk.com/agent/tickets/1?zat=true


## Publishing the App

Instructions here: https://developer.zendesk.com/apps/docs/publish/

### Updating Copy

The long description and installation instructions need to be in markdown saved as fields in the `en.json` file. To make changes, edit the files in the `copy` folder, then run:

  $ python make.py --update --make_html

The `--make_html` flag will generate html files in the `_build` directory to make sure everything is rendering correctly.

### Generate the Build

Checklist:

- updated branding and screenshots go in `./src/assets`. See: https://developer.zendesk.com/apps/docs/publish/create_assets
- update `./src/translations/en.json` with app copy (see above)
- update app version in `./src/manifest.json`
- generate a new zip file of the app by running:

    $ zat package --path=./src

- publish it to the marketplace by uploading the zip file
- tag the release in github