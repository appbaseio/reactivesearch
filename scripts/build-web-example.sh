#!/usr/bin/env bash

echo Upgrading examples RS version to $1

var=`pwd`
for d in packages/web/examples/*/ ; do
    cd $var/$d
    yarn add @appbaseio/reactivesearch@$1
done

echo Examples RS version upgraded to $1
