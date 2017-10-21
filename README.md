# Twitter OSS Metrics

### Project Overview
* Twitter supports and uses *hundreds* of Open Source projects. If Twitter is involved in a project, or considering involvement, we want to better understand the health of both the code and community.
* Current lack of detailed metrics and reports for stakeholders on activity and growth of Twitter’s Open Source projects
* Core problem for Open Source community: How can we get more people to contribute to open source and create a more positive community?

### Short-term Goals of this Project
* Monitor contributions to Twitter Open Source projects and collect insights on community health and ecosystem activity.
* Visualize key metrics in a report, (ideally, a dashboard) and automate generation of reports on a weekly and monthly (ideally daily, realtime) basis.
* Integrate with tools used by Twitter engineering team to manage their projects (GitHub, Slack, TwitterDev for starters, ideally Phabricator, Jira, and Confluence as well.)

## Description
The idea is to create a front-end that will generate meaningful reports for open source projects. Take a look at open issues for a idea of where this project is currently heading. This project will become the place to understand your open source projects and download as a fully functional report. 

## Setup

This project is built as pure client-side react implementation. It was created using [create-react-app](https://github.com/facebookincubator/create-react-app)

Note that github api is currently being queried with no authentication so limit is low.

### Requirements
* npm version >5.3
* Node version >7.2.1

_Should work with older versions but has not been tested_

### Installation
After clone run

` npm install `

Start dev server at  http://localhost:3000 with

` npm start`

Build static version for production to folder _docs_.

You will need to add valid auth headers to auth object at the top of App.js if your github api limit isß exceeded.

` npm run build`

Change the homepage value in package.json to build to a absolute url if you do not want the project to be served relative to the _docs_ folder.

## Contributing

We'd love to have your helping hand on twitter-oss-metrics! See CONTRIBUTING.md for basic information on what we're looking for and how to get started (CONTRIBUTING.md will be edited soon for more specific information on how help.)


### What's Inside?

* [React](https://reactjs.org/)
* [Semiotic](https://emeeks.github.io/semiotic/#/)
* [d3.js](https://d3js.org/) 
* [Material-ui](http://www.material-ui.com/#/)

### Team Memebers
* Remy DeCausemaker
* Casey Haber
* Gordon Li
* Miguel Arreguin
* Nyssa Chennubhotla
