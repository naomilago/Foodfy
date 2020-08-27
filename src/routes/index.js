const express = require('express');
const routes = express.Router();

const home = require('./home');
const admin = require('./admin');

const users = require('./users');
const chefs = require('./chefs');
const recipes = require('./recipes');

routes.use("/", home);
routes.use("/admin", admin);
routes.use("/admin/users", users);
routes.use("/admin/chefs", chefs);
routes.use("/admin/recipes", recipes);

module.exports = routes;