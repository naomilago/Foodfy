const { hash } = require('bcryptjs');
const faker = require('faker');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');
const RecipeFile = require('./src/app/models/RecipeFile');

let usersIds = [],
    chefsIds = [],
    recipesIds = [];

const totalUsers = 5;
const totalChefs = 4;
const totalRecipes = 10;

async function createUsers() {
    const users = [];
    const password = await hash("123", 8);

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: 1
        });
    }

    const usersPromise = users.map(user => User.create(user));
    usersIds = await Promise.all(usersPromise);
}

async function createChefs() {
    let files = [],
        chefs = [],
        i = 0;

    while (files.length < totalChefs) {
        files.push({
            name: faker.name.firstName(),
            path: `https://source.unsplash.com/collection/787231/200x200`
        });
    }

    const filesPromise = files.map(file => File.create(file));
    filesIds = await Promise.all(filesPromise);

    while (chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
            file_id: filesIds[i]
        });

        i += 1;
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef));
    chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes() {
    let recipes = [],
        files = [];
    
    while (recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" "),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" "),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 5))
        });
    }
  
    const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
    recipesIds = await Promise.all(recipesPromise);
    
    while (files.length < totalRecipes) {
        files.push({
            name: faker.commerce.productName(),
            path: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=280&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=600"
        });
    }
  
    const filesPromise = files.map(file => File.create(file));
    recipesImages = await Promise.all(filesPromise);
}
  
async function createRecipeFile() {
    let recipeFiles = [];
    let i = 0;
  
    while (recipeFiles.length < totalRecipes) {
        recipeFiles.push({
            recipe_id: recipesIds[i],
            file_id: recipesImages[i]
        });

        i += 1;
    }
  
    const recipeFilesPromise = recipeFiles.map(recipeFile => RecipeFile.create(recipeFile));  
    await Promise.all(recipeFilesPromise);
}
  
async function init() {
    await createUsers(),
    await createChefs(),
    await createRecipes(),
    await createRecipeFile();
}
  
init();