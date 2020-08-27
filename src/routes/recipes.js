const express = require('express');
const routes = express.Router();

const { onlyUsers, verifyAdmin } = require('../app/middlewares/session');
const multer = require('../app/middlewares/multer');

const Validator = require('../app/validators/recipes');
const RecipeController = require('../app/controllers/RecipeController');

routes.get("/", onlyUsers, RecipeController.index);
routes.get("/create", onlyUsers, RecipeController.create);
routes.get("/:id", onlyUsers, RecipeController.show);
routes.get("/:id/edit", verifyAdmin, RecipeController.edit);

routes.post("/", multer.array("images", 5), Validator.post, RecipeController.post);
routes.put("/", multer.array("images", 5), verifyAdmin, Validator.update, RecipeController.put);
routes.delete("/", verifyAdmin, RecipeController.delete);

module.exports = routes;