## Run the example

- Run the example locally
  + Clone the repository and `cd` to this directory
  + Run `yarn` to install the dependencies
  + Run `react-native link` to get nativebase to work
  + Run `yarn start` to start the packager
  + Scan the QR Code with the Expo app

## Running the storybook

1. Run storybook first:
```bash
yarn storybook
```

2. Start the packager to run the storybook UI:
```bash
yarn start-storybook
```

3. You may browse the stories using the Expo app on your phone or on the browser at http://localhost:7007

## Debugging

The simplest way to debug the app is using [React Native Debugger](https://github.com/jhen0409/react-native-debugger).

## Troubleshooting

- Reset cache `yarn start --reset-cache` or `yarn start-storybook --reset-cache`