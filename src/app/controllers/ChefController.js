const { unlinkSync } = require('fs');

const Chef = require("../models/Chef");
const File = require("../models/File");

const LoadChefService = require("../services/LoadChefService");

module.exports = {
    async index(req, res) {
        try {
            const chefs = await LoadChefService.load("chefs");
            return res.render("admin/chefs/index", { chefs });
        } catch (error) {
            console.error(error);
        }
    },
    
    create(req, res) {
        return res.render("admin/chefs/create");
    },
    
    async post(req, res) {
        try {
            const filePromise = req.files.map((file) => File.create({ name: file.filename, path: file.path }));
            const filesId = await Promise.all(filePromise);
  
            const relationPromise = filesId.map((fileId) => Chef.create({ ...req.body, file_id: fileId }));
            await Promise.all(relationPromise);
  
            return res.redirect(`/admin/chefs/${chefId}`);

        } catch (error) {
            console.error(error);
        }
    },
    
    async show(req, res) {
        try {
            let chef = await LoadChefService.load("chef", req.params.id);
            if (!chef) return res.render("404", { error: "Chef não encontrado!" });
    
            let image = await Chef.files(chef.id);
            if (image[0]) image.src = image[0].path.replace("public", "");
    
            const recipes = await LoadChefService.load("recipes");
            return res.render("admin/chefs/show", { chef, image, recipes });

        } catch (error) {
            console.error(error);
        }
    },
    
    async edit(req, res) {
        try {
            let chef = await Chef.find(req.params.id);
            if (!chef) return res.render("404", { error: "Chef não encontrado!" });
    
            let files = await Chef.files(chef.id);

            files = files.map((file) => ({
                ...file,
                src: files[0].path.replace("public", ""),
            }));
    
            return res.render("admin/chefs/edit", { chef, files });

        } catch (error) {
            console.error(error);
        }
    },
    
    async put(req, res) {
        try {
            let { name } = req.body;
    
            if (req.files.length != 0) {
                
                const file = req.files[0];
                let fileId = await File.create({ name: file.filename, path: file.path });
                await Chef.update(req.body.id, { name, file_id: fileId });

            } else {
                if (req.body.removed_files != "" && req.files[0] == undefined) {
                    req.session.error = "Por favor, envie pelo menos uma imagem.";
                    return res.redirect("back");
                }
            }
        
            if (req.body.removed_files) {
                const removedFiles = fields.removed_files.split(",");
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(async (id) => {
                    try {
                        const file = await File.findOne({ where: { id }});
                        File.delete(id);
                        unlinkSync(file.path);
                    } catch (error) {
                        console.error(error);
                    }
                });

                await Promise.all(removedFilesPromise);
            }
        
            await Chef.update(req.body.id, { name });
            
            req.session.success = "Chef atualizado com sucesso!";
            return res.redirect(`/admin/chefs/${req.body.id}`);
            
        } catch (error) {
            console.error(error);
        }
    },
    
    async delete(req, res) {
        try {
            const files = await Chef.files(req.body.id);
            await Chef.delete(req.body.id);

            files.map((file) => {
                try {
                    File.delete(file.file_id);
                    unlinkSync(file.path);
                } catch (error) {
                    console.error(error);
                }
            });

            req.session.success = "Chef deletado com sucesso!";
            return res.redirect("/admin/chefs");

        } catch (error) {
            console.error(error);
        }
    }
};