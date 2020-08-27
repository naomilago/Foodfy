const { compare } = require("bcryptjs");

const User = require("../models/User");

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Favor preencher todos os campos"
            };
        }
    }
}

module.exports = {
    async show(req, res, next) {
        const { userId: id } = req.session;

        try {
            const user = await User.findOne({ where: { id }});

            if (!user) return res.render("admin/user/create", { error: "Usuário não encontrado" });

            req.user = user;

            next();

        } catch (error) {
            console.error(error);
        }
    },

    async update(req, res, next) {
        const fillAllFields = checkAllFields(req.body);

        try {
            if (fillAllFields) return res.render("admin/user/profile", fillAllFields);

            const { id, password } = req.body;

            if (!password) {
                return res.render("admin/user/profile", {
                    user: req.body,
                    error: "Por favor, digite sua senha para atualizar os dados."
                });
            }

            const user = await User.findOne({ where: { id }});
            const passed = await compare(password, user.password);

            if (!passed) {
                return res.render("admin/user/profile", {
                    user: req.body,
                    error: "A senha informada está incorreta, tente novamente."
                });
            }

            req.user = user;

            next();

        } catch (error) {
            console.error(error);
        }
    }
};
