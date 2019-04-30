const onRouteUpdate = require(`./gatsby/onRouteUpdate`);
const onPreRouteUpdate = require(`./gatsby/onPreRouteUpdate`);

exports.onRouteUpdate = () => onRouteUpdate.trustAllScripts();

exports.onPreRouteUpdate = () => onPreRouteUpdate.killServiceWorker();
