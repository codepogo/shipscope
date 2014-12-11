# Shipscope

Shipscope is a Chrome browser extension that monitors your projects on [Codeship](https://codeship.com). It provides the following features:

* Shipscope presents a popup containing all of your projects.
* The status of each project’s master branch is indicated next to the project name. 
* Clicking a project shows you the last 10 builds for that project.
* Each build’s status is displayed in the build list.
* If a build is running, you see a little spinny thing. That never gets boring.
* If a build has completed, you can restart it and get that spinny thing going again!

Install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/shipscope/jdedmgopefelimgjceagffkeeiknclhh?hl=en). Please leave reviews and suggestions in the store.

---

## Development

### Codeship Build Status
[![Codeship Status for codeship/shipscope](https://codeship.com/projects/65d07f70-1760-0132-b253-1a9c2abd41b7/status) ](https://codeship.com/projects/34082)

### Features/Bugs
[![Stories in Ready](https://badge.waffle.io/codeship/shipscope.png?label=ready&title=Ready)](https://waffle.io/codeship/shipscope)

### Prerequisites

* node
* npm
* grunt

### Steps

1. Clone this repository
1. `npm install`
1. `grunt build`
1. Open the Chrome Extension Manager at chrome://extensions
1. Check the **Developer mode** box
1. Click **Load unpacked extension**
1. Select the folder containing: `codeship/app`

The Shipscope icon should appear in your menu bar.
