#!/usr/bin/env bash

git push origin `git subtree split --prefix site HEAD`:gh-pages --force
