const express = require('express');
const routes = express.Router();

const { onlyUsers, isLoggedRedirectToProfile } = require('../app/middlewares/session');

const SessionValidator = require('../app/validators/session');
const ProfileValidator = require('../app/validators/profile');

const SessionController = require('../app/controllers/SessionController');
const ProfileController = require('../app/controllers/ProfileController');

// Login and Logout
routes.get("/", isLoggedRedirectToProfile, SessionController.loginForm);
routes.get("/login", isLoggedRedirectToProfile, SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", onlyUsers, SessionController.logout);

// Forgot and Reset password
routes.get("/forgot-password", SessionController.forgotForm);
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot);

routes.get("/password-reset", SessionController.resetForm);
routes.post("/password-reset", SessionValidator.reset, SessionController.reset);

// User Profile
routes.get("/profile", ProfileValidator.show, ProfileController.show);
routes.put("/profile", ProfileValidator.update, ProfileController.put);

module.exports = routes;