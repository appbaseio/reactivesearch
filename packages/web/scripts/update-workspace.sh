echo Upgrading related Workspace to $1

 cd ../maps && ls && yarn add @appbaseio/reactivesearch@$1 && cd ../playground && yarn add @appbaseio/reactivesearch@$1 && cd ../web

 echo Workspace RS version upgraded to $1
