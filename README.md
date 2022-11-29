# Choreganise

A simple way to organise your household chores and get them done more efficiently.

Motivating yourself to do chores can be tough enough without having to make a series of decisions about which ones to prioritise and which you don't have time for right now. If you struggle with decision anxiety or overwhelm whenever you think about housework, you might like to meet Choregi - your faithful housework companion!

When Choregi makes the decisions, you can focus on getting things done. Choregi prioritises your housework and compiles a list of the most important tasks that will fit into the time you have available. Then it shows you which task is top of the list. Only one task is shown so you don't get overwhelmed. Once that one task is complete, you'll see one more. When you run out of time, Choregi stops showing new tasks and leaves you to enjoy the rest of your day.

## Caution

This project is not in a stable condition. It is at an early stage of development and may be subject to major changes without notice. Updates may result in data loss or other issues.

## Deployment

This project has been tested on Heroku using the `heroku/nodejs` buildpack. It should be straightforward to deploy a new copy of Choreganise to any platform which supports Node.js or Docker containers.

For example, assuming you are somewhat familiar with GitHub and the Heroku platform, the following steps should give you a decent starting point for managing your own deployment:

1. Clone this repository in GitHub
1. Create a Heroku pipeline with an app linked to the new repository
1. Deploy the `main` branch using the controls in the Heroku pipeline view

Once the app is deployed and working, there are a couple of optional steps to streamline the testing and deployment process if you plan to make changes to your Choreganise clone:

1. Configure the Heroku pipeline to automatically create review apps for new PRs
1. Configure the Heroku app to use automatic deploys from the `main` branch

## Development

Use Docker Compose to build and run this project in development:

```
docker-compose up
```

Alternative, you can run this project directly in Node.js using the NPM scripts declared in [`package.json`](./package.json).

## NPM Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## License & Copyright

Copyright (C) 2022 David and Felicity Bingham

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
