const Recipe = require('../models/Recipe');
const RecipeFile = require('../models/RecipeFile');
const Chef = require('../models/Chef');

const LoadRecipeService = require('../services/LoadRecipeService');
const LoadChefService = require('../services/LoadChefService');

module.exports = {
    async index(req, res) {
        try {
            const allRecipes = await LoadRecipeService.load("recipes");
            const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true);
            return res.render("home/index", { recipes });
        } catch (error) {
            console.error(error);
        }
    },
    
    about(req, res) {
        return res.render("home/about");
    },
    
    async recipes(req, res) {
        try {
            let { filter, page, limit } = req.query;

            page = page || 1;
            limit = limit || 9;
            let offset = limit * (page - 1);

            const params = { filter, page, limit, offset };

            let recipes = await Recipe.paginate(params);
            if (recipes[0] == undefined) return res.render("home/recipes", { filter });

            const recipesPromise = recipes.map(async recipe => {
                const files = await RecipeFile.files(recipe.id);
                if (files[0]) recipe.img = files[0].path.replace("public", "");
            });

            await Promise.all(recipesPromise);

            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
                filter
            };

            return res.render("home/recipes", { recipes, pagination, filter });

        } catch (error) {
            console.error(error);
        }
    },
    
    async recipe(req, res) {
        try {
            const recipe = await LoadRecipeService.load("recipe", req.params.id);
            if (!recipe) return res.render("404", { error: "Receita não encontrada!" });            
            return res.render("home/recipe", { recipe });
        } catch (error) {
            console.error(error);
        }
    },
    
    async chefs(req, res) {
        try {
            const chefs = await LoadChefService.load("chefs");
            return res.render("home/chefs", { chefs });
        } catch (error) {
            console.error(error);
        }
    },
    
    async chef(req, res) {
        try {
            let chef = await LoadChefService.load("chef", req.params.id);
            if (!chef) return res.render("404", { error: "Chef não encontrado!" });
    
            let image = await Chef.files(chef.id);
            if (image[0]) image.src = image[0].path.replace("public", "");
    
            const recipes = await LoadChefService.load("recipes");
            return res.render("home/chef", { chef, image, recipes });
            
        } catch (error) {
            console.error(error);
        }
    }
};
