const User = require("../models/User");

function checkAllFields(body) {
    const keys = Object.keys(body);
  
    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Por favor, preencha todos os campos."
            };
        }
    }
}

module.exports = {
    async post(req, res, next) {
        const fillAllFields = checkAllFields(req.body);
        
        try {
            if (fillAllFields) return res.render("admin/user/create", fillAllFields);
    
            let { email } = req.body;
    
            const user = await User.findOne({ where: { email }});
    
            if (user) {
                return res.render("admin/user/create", {
                    user: req.body,
                    error: "Usuário já cadastrado."
                });
            }
        
            next();
            
        } catch (error) {
            console.error(error);
        }
    },

    async show(req, res, next) {
        const id = req.params.id;

        try {
            const user = await User.findOne({ where: { id }});

            if (!user)
                return res.render("admin/user/index", {
                error: "Usuário não encontrado!"
            });

            req.user = user;

            next();

        } catch (error) {
            console.error(error);
            return res.render("admin/user/index", {
                error: "Algo de errado ocorreu, por favor tente novamente!"
            });
        }
    }
};
