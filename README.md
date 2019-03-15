# ar.reactjs.org

This repo contains the source code and documentation powering [ar.reactjs.org](https://ar.reactjs.org). (Work in Progress)

## Getting started

### Prerequisites

1. Git
1. Node: any 8.x version starting with 8.4.0 or greater
1. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [ar.reactjs.org repo](https://github.com/reactjs/ar.reactjs.org) on your local machine

### Installation

1. `cd ar.reactjs.org` to go into the project root
1. `yarn` to install the website's npm dependencies

### Running locally

1. `yarn dev` to start the hot-reloading development server (powered by [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` to open the site in your favorite browser

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/ar.reactjs.org/blob/master/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Steps

1. Check that no one else has claimed your page in the checklist and comments of [Arabic Translation Progress](https://github.com/reactjs/ar.reactjs.org/issues/1) and the pull requests.
2. Comment at [Arabic Translation Progress](https://github.com/reactjs/ar.reactjs.org/issues/1) with the name of the page you would like to translate. **Please take only one page at a time.**
3. [Fork and Setup Repo](https://github.com/reactjs/ar.reactjs.org#fork-and-setup-repo), translate your page, and submit a pull request!

Before contributing, read the [glossary](https://github.com/reactjs/ar.reactjs.org/wiki/Glossary) and [style guide](https://github.com/reactjs/reactjs.org-translation/blob/master/style-guide.md) to understand how to translate various technical and React-specific terms.

And use [Hsoub's translation](https://wiki.hsoub.com/React) as a reference.


#### Fork and Setup Repo
1. Fork the repo
2. Clone forked repo on your local machine
3. `cd ar.reactjs.org` to go into the project root
4. `git remote add upstream https://github.com/reactjs/ar.reactjs.org` to add original repo as an upstream
5. `yarn` to install the website's npm dependencies

#### Create a branch

1. `git checkout master` from any folder in your local `ar.reactjs.org` repository
1. `git pull upstream master` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

#### Make the change

1. Follow the ["Running locally"](#running-locally) instructions
1. Save the files and check in the browser
  1. Changes to React components in `src` will hot-reload
  1. Changes to markdown files in `content` will hot-reload
  1. If working with plugins, you may need to remove the `.cache` directory and restart the server

#### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
1. Run `yarn check-all` from the project root. (This will run Prettier, ESLint, and Flow.)

#### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fixed header logo on Android`) to stage and commit your changes
1. `git push origin the-name-of-my-branch`
1. Go to the [reactjs.org repo](https://github.com/reactjs/reactjs.org) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A Netlify build will also be automatically created once you make your PR so other people can see your change.

## Translation

If you are interested in translating `reactjs.org`, please see the current translation efforts at [isreacttranslatedyet.com](https://www.isreacttranslatedyet.com/).


If your language does not have a translation and you would like to create one, please follow the instructions at [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Troubleshooting

- `yarn reset` to clear the local cache

## License
Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
