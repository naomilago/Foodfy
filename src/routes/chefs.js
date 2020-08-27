const express = require('express');
const routes = express.Router();

const { isAdmin, onlyUsers } = require('../app/middlewares/session');
const multer = require('../app/middlewares/multer');

const Validator = require('../app/validators/chefs');
const ChefController = require('../app/controllers/ChefController');

routes.get("/", onlyUsers, ChefController.index);
routes.get("/create", isAdmin, ChefController.create);
routes.get("/:id", onlyUsers, ChefController.show);
routes.get("/:id/edit", isAdmin, ChefController.edit);

routes.post("/", multer.array("images", 1), Validator.post, ChefController.post);
routes.put("/", multer.array("images", 1), isAdmin, Validator.update, ChefController.put);
routes.delete("/", isAdmin, ChefController.delete);

module.exports = routes;