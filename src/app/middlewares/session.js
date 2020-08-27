const Recipe = require("../models/Recipe");

module.exports = {
    onlyUsers(req, res, next) {
        if (!req.session.userId) return res.redirect("/admin/login");
        next();
    },

    isLoggedRedirectToProfile(req, res, next) {
        if (req.session.userId) return res.redirect("/admin/profile");
        next();
    },
    
    isAdmin(req, res, next) {
        if (!req.session.userId) return res.redirect("/admin/login");
        if (req.session.userId && req.session.isAdmin == false) return res.redirect("/admin/profile");
        next();
    },
    
    async verifyAdmin(req, res, next) {
        if (!req.session.userId) return res.redirect("/admin/login");

        let id = req.params.id;
        if (!id) id = req.body.id;

        const recipe = await Recipe.findOne(id);
        user = recipe.user_id;

        if (req.session.userId && user != req.session.userId && req.session.admin == false) {
            return res.redirect(`/admin/recipes/${id}`);
        }

        next();
    }
};
