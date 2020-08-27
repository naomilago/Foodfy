const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "chefs" });

module.exports = {
    ...Base,
    
    async findAll() {
        try {
            const results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
                ORDER BY total_recipes DESC`
            );

            return results.rows;

        } catch (error) {
            console.error(error);
        }
    },
    
    async findOne(id) {
        try {
            const results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
                ORDER BY total_recipes DESC`, [id]
            );

            return results.rows[0];

        } catch (error) {
            console.error(error);
        }
    },
    
    async recipes() {
        try {
            const results = await db.query(`
                SELECT id, chef_id, title
                FROM recipes
                ORDER BY created_at DESC`
            );

            return results.rows;

        } catch (error) {
            console.error(error);
        }
    },
    
    async files(id) {
        try {
            const results = await db.query(`
                SELECT * FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1`, [id]
            );
            
            return results.rows;
            
        } catch (error) {
            console.error(error);
        }
    }
};
