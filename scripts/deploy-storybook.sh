#!/usr/bin/env bash

echo Publishing Storybook

cd $1
cd packages/playground
yarn build-storybook
yarn deploy-storybook

echo Published Storybook
