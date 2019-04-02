#!/usr/bin/env bash

echo Upgrading examples RS version to $1

for d in examples/*/ ; do
    var=`pwd`
    echo $d
    cd $var/$d
    yarn add @appbaseio/reactivesearch@$1
    cd ../../
done

echo Examples RS version upgraded to $1
