const posts = require('./posts');
const users = require('./users');

const routes = [
    { path: '/post', router: posts },
    { path: '/user', router: users }
];

function config (app) {
    routes.forEach((route) => {
        app.use(route.path, route.router);
    });
}

module.exports = config;
