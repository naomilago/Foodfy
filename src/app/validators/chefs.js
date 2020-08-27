module.exports = {
    post(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.render("admin/chefs/create", {
                    recipes: req.body,
                    error: "Por favor, preencha todos os campos!"
                });
            }
        }

        if (!req.files || req.files.length == 0) {
            return res.render("admin/chefs/create", {
                recipes: req.body,
                error: "Por favor, envie pelo menos uma imagem."
            });
        }

        next();
    },

    update(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") { 
                return res.render("admin/chefs/edit", {
                    recipes: req.body,
                    error: "Por favor, preencha todos os campos!"
                });
            }
        }

        next();
    }
}
