module.exports = {
    post(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.render("admin/recipes/create", {
                    recipe: req.body,
                    error: "Por favor, envie pelo menos uma imagem."
                });
            }
        }

        if (!req.files || req.files.length == 0) {
            return res.render("admin/recipes/create", {
                recipe: req.body,
                error: "Por favor, preencha todos os campos!"
            });
        }

        next();
    },

    update(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information" && key != "removed_files") { 
                return res.render("admin/recipes/edit", {
                    recipe: req.body,
                    error: "Por favor, preencha todos os campos!"
                });
            }
        }

        next();
    }
}
