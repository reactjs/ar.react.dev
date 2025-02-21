# reactjs.org

This repository contains the source code and documentation that powers [reactjs.org](https://reactjs.org/).

## Getting Started

### Prerequisites

1. Git
2. Node: any version 12.x starting with v12.0.0 or greater
3. Yarn: Refer to the [Yarn website](https://yarnpkg.com/lang/en/docs/install/) for installation instructions
4. A fork of the repository (for any contributions)
5. A clone of the [ar.react.dev repo](https://github.com/reactjs/ar.react.dev) on your local machine

### Installation

1. Navigate to the project root by running `cd ar.react.dev`
2. Install the website's npm dependencies with `yarn`

### Running Locally

1. Start the development server (powered by [Next.js](https://nextjs.org/)) with `yarn dev`
2. Open [http://localhost:3000](http://localhost:3000) in your preferred browser

## Contributing

### Guidelines

The documentation is divided into several sections, each with a different tone and purpose. If you plan to write more than a few sentences, it might be helpful to familiarize yourself with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the relevant sections.

1. Switch to the `main` branch from any folder in your local `ar.react.dev` repository using `git checkout main`
2. Ensure you have the latest main code by running `git pull origin main`
3. Create a new branch with a suitable name using `git checkout -b the-name-of-my-branch`

#### Make the Change

1. Follow the ["Running Locally"](#running-locally) instructions
2. Save the files and check in the browser
   - Changes to React components in `src` will hot-reload
   - Changes to markdown files in `content` will hot-reload
   - If working with plugins, you may need to remove the `.cache` directory and restart the server

#### Test the Change

1. If possible, test any visual changes in all the latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all`. (This will run Prettier, ESLint, and validate types.)

#### Push It

1. Stage and commit your changes with `git add -A && git commit -m "My message"` (replace `My message` with a commit message, such as `Fix header logo on Android`)
2. Push your branch using `git push my-fork-name the-name-of-my-branch`
3. Visit the [react.dev repo](https://github.com/reactjs/react.dev), where you should see the recently pushed branches.
4. Follow GitHub's instructions.
5. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.

## Translation

If you are interested in translating `react.dev`, please see the current translation efforts [here](https://github.com/reactjs/react.dev/issues/4135).

## License

Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.
