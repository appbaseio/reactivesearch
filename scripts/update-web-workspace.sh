echo Upgrading related Workspace to $1

cd packages/playground && yarn add @appbaseio/reactivesearch@$1 && cd ../maps && yarn add @appbaseio/reactivesearch@$1 && cd ../..

echo Workspace RS version upgraded to $1
