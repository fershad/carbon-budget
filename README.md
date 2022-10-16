# Carbon Budget

⚠️⚠️ **Still a work in progress** ⚠️⚠️

A script that allows developers to set a per-page carbon budget for their website, and then run a scan over their entire site to find pages that exceed that budget. Like a performance budget, but for carbon emissions.

## How might you use this?

This could be used to scan an existing website, or as part of a website audit. However, an even better application would be to run these scripts as part of a website development test suite. In that way, you will be able to catch potentially harmful pages before they are even deployed.

## Getting started

All the files you need are in the `src` folder. You can clone this repo, and use those files to get started.

### Demo

To try a demonstration, run `npm run demo` or `node demo/index.js`.
You can change the options that are set when running the demo:

- `siteUrl`: The base url of the site to be tested. The crawler will try to find all pages on the site from this url.
- `model` (_optional_): The carbon estimation model to use. This project uses [CO2.js](https://github.com/thegreenwebfoundation/co2.js), so information about the available models can be found in the [CO2.js docs](https://developers.thegreenwebfoundation.org/co2js/models/).
- `budget` (_optional_): An object containing either:
  - `kb`: A value (in kilobytes) that will be used to determine a suitable carbon budget for your site. This is recommended for people new to website carbon reporting.
  - `co2`: A value (in grams) for the per page carbon budget you want to set

## To-do

- [ ] Concurrent lighthouse runs
- [ ] Turn this into an NPM package that can be installed in a project
- [ ] Add some tests
