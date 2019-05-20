#!/usr/bin/env bash

echo Building Demos

for d in $1/site/demos/*/ ; do
    echo $d
    cd $d
    yarn build
    cd ../../../
done

echo Demos Build Completed
