#!/usr/bin/env bash

echo Building Demos

for d in site/demos/*/ ; do
    var=`pwd`
    echo $d
    cd $var/$d
    yarn build
    cd ../../../
done

echo Demos Build Completed
