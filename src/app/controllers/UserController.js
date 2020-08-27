const { hash } = require('bcryptjs');
const { randomBytes } = require('crypto');

const User = require('../models/User');

const mailer = require ('../../lib/mailer');

const email = (userName, userEmail, userPass) => `
    <h2>Olá, ${userName}!</h2>
    <p>Seu acesso ao Foodfy foi criado, abaixo estarão seus dados para acessar sua conta.</p>
    <p><br /><br /></p>
    <p>Login: <strong>${userEmail}</strong></p>
    <p>Senha: <strong>${userPass}</strong></p>
    <p><br /><br /></p>
    <p>Para validar o seu acesso, você precisará fazer seu primeiro login!</p>
    <p>Entre clicando <a href="http://localhost:3000/admin/users/login"><strong>aqui</strong></a>.</p>
`;

module.exports = {
    async index(req, res) {
        try {
            const users = await User.findAll();
            return res.render("admin/user/index", { users });
        } catch (error) {
            console.error(error);
        }
    },

    create(req, res) {
        return res.render("admin/user/create", { user });
    },
    
    async post(req, res) {
        try {
            const password = randomBytes(8);

            await mailer.sendMail({
                to: req.body.email,
                from: "no-replay@foodfy.com.br",
                subject: "Cadastro realizado",
                html: email(req.body.name, req.body.email, password)
            });

            const passwordHash = await hash(password, 8);

            const user = {
                name: req.body.name,
                email: req.body.email,
                password: passwordHash,
                is_admin: req.body.is_admin || 0
            };

            const userId = await User.create(user);
            return res.redirect(`/admin/users/${userId}`);

        } catch (error) {
            console.error(error);
        }
    },
        
    async show(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findOne({ where: { id }});
            
            return res.render("admin/user/show", { user });

        } catch (error) {
            console.error(error);
            return res.render("admin/user/create", {
                error: "Usuário não encontrado."
            });
        }
    },
    
    async put(req, res) {
        try {
            const { id } = req.body;

            const user = await User.update(id, {
                name: req.body.name,
                email: req.body.email,
                is_admin: req.body.is_admin || 0
            });

            return res.render("admin/user/show", {
                user: { 
                    ...user, 
                    id 
                },
                success: "Usuário atualizado com sucesso!"
            });

        } catch (error) {
            console.error(error);
            return res.render("admin/user/show", {
                error: "Houve um erro, por favor, tente novamente."
            });
        }
    },
    
    async delete(req, res) {
        try {
            const userId = req.body.id;
            await User.delete(userId);
            return res.render("admin/user/index", { success: "Usuário deletado com sucesso!" });
        } catch (error) {
            console.error(error);
        }
    }
}