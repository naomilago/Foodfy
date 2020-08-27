const User = require('../models/User');

module.exports = {
    async show(req, res) {
        try {
            const { user } = req;
            return res.render("admin/user/profile", { user });
        } catch (error) {
            console.error(error);
        }
    },

    async put(req, res) {
        try {
            let { name, email } = req.body;
            const { user } = req;

            await User.update(user.id, { name, email });

            return res.render("admin/user/profile", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            });

        } catch (error) {
            console.error(error);
            return res.render("admin/user/profile", {
                user: req.body,
                error: "Houve um problema, por favor, tente novamente."
            });
        }
    }
};
