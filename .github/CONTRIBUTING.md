# ReactiveSearch Contribution Guide 🔍

Welcome to the contribution guide! We welcome all contributions. A list of issues is present [here](https://github.com/appbaseio/reactivesearch/issues). If you're interested in picking up something, feel free to start a discussion 😺

The reactivesearch monorepo contains the code for both the [web](../packages/web) and [native](../packages/native) libraries. Both uses a common [core](https://github.com/appbaseio/reactivecore/) architecture. Project specific readme files are available inside each package.

## Initial setup

Currently the initial setup is a bit manual which we're planning to improve. We also recommend to have [SSH setup](https://help.github.com/articles/connecting-to-github-with-ssh/) for GitHub.

1. Fork the repo in order to send PRs

2. Clone the repo from your profile, use SSH if possible

3. `cd` into the project directory

4. Checkout the `dev` branch (should be default)

5. Fetch the submodules. In case you don't have `ssh` setup for github, change the URLs in `.gitmodules` to use `https` instead

```bash
git submodule init
git submodule sync
git submodule update --remote
```

6. The submodules will be fetched into `/packages`. Defaults to `dev` in `/packages/playground` and `master` in `/packages/reactivecore`.

7. You can then install the dependencies, we recommend `yarn`. Run this from the project root:

```bash
yarn
```

## Web

1. You can run the following command from `reactivesearch` root which will start the babel watchers inside `/reactivecore` and `/web`. This will let you make changes to these projects on the fly and the files will be transpiled and updated instantly:

```bash
yarn dev:web
```

Alternatively the manual approach would be to open the sub-projects for `/web` and `/reactivecore` and start the watchers inside their respective directories.

2. You can try the examples for any of the `web` components inside `/packages/web/examples` which will also pick the updated code as and when you make changes to the `/packages/web/src` files.

3. Another way to try out the components is by checking into `/packages/playground` and running the storybook which also updates itself from the components inside `/packages/web/src`.

```bash
yarn storybook
```

**Note:** If you see any errors about missing dependencies, please try running `yarn` inside the sub-directory you're at.

## Vue

1. You can run the following command from `reactivesearch` root which will start the babel watchers inside `/reactivecore` and `/vue`. This will let you make changes to these projects on the fly and the files will be transpiled and updated instantly:

```bash
yarn dev:vue
```

Alternatively the manual approach would be to open the sub-projects for `/vue` and `/reactivecore` and start the watchers inside their respective directories.

2. You can try the examples for any of the `vue` components inside `/packages/vue/examples` which will also pick the updated code as and when you make changes to the `/packages/vue/src` files.

3. Another way to try out the components is by checking into `/packages/vue-playground` and running the storybook which also updates itself from the components inside `/packages/vue/src`.

```bash
yarn storybook
```

**Note:** If you see any errors about missing dependencies, please try running `yarn` inside the sub-directory you're at.


## Native

1. `cd` into the `/packages/native` directory and install dependencies if not done already by running `yarn`.

2. You can try the example app which would also get updated from the native components source from `/packages/native/src`. Run the example in Expo from `/packages/native/example` using:

```bash
yarn start
```

3. You can also try the native storybook from `/packages/native/example` by:

```bash
yarn storybook
```

and in a new terminal:

```bash
yarn start-storybook
```

4. You may browse the stories using the Expo app on your phone or on the browser at http://localhost:7007

**Troubleshooting:** You might need to add a flag `--reset-cache` to the above commands if you're seeing stale builds.

5. The individual components examples for native are present in `/packages/native/examples` in order to test the components.

## Native Debugging

The simplest way to debug the app is using [React Native Debugger](https://github.com/jhen0409/react-native-debugger).

## Site

The website source code is available in `/site` which also includes the demo apps in `/site/demos`. Each demo app can be used as a standalone app and would also update from the `/packages/web/src` files as long as the watcher is running at the project root.

<hr />

If you run into any problems please feel free to reach out to us 🙂
