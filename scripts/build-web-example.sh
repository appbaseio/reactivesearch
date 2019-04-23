#!/usr/bin/env bash

echo Upgrading examples RS version to $1

var=`pwd`
for d in packages/web/examples/*/ ; do
    cd $var/$d
    node <<EOF

    var fs = require("fs");
    var appPackageJSON = require("./package.json");
    appPackageJSON.dependencies['@appbaseio/reactivesearch'] = "$1";

    var updatedJSON = JSON.stringify(appPackageJSON, null, 4);

    fs.writeFile("./package.json", updatedJSON, "utf8", (err) => {
    if (err)
        throw err;
    console.log("$d", 'Example Updated to', "$1");
    });

EOF
done

echo Examples RS version upgraded to $1
