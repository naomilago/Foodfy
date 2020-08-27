const express = require("express");
const routes = express.Router();

const { isAdmin } = require('../app/middlewares/session');
const Validator = require('../app/validators/user');
const UserController = require('../app/controllers/UserController');

// Users
routes.get("/", isAdmin, UserController.index);
routes.get("/create", isAdmin, UserController.create);
routes.get("/:id", isAdmin, Validator.show, UserController.show);

routes.post("/", isAdmin, Validator.post, UserController.post);
routes.put("/", isAdmin, UserController.put);
routes.delete("/", isAdmin, UserController.delete);

module.exports = routes;