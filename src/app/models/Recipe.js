const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "recipes" });

module.exports = {
    ...Base,
    
    async findAll() {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS author
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY updated_at DESC`
            );

            return results.rows;
            
        } catch (error) {
            console.error(error);
        }
    },
    
    async findOne(id) {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS author
                FROM recipes
                LEFT JOIN chefs on (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1`,[id]
            );

            return results.rows[0];

        } catch (error) {
            console.error(error);
        }
    },

    async paginate(params) {
        try {
            const { filter, limit, offset } = params;
        
            let query = "",
                filterQuery = "",
                totalQuery = `(SELECT count(*) FROM recipes) AS total`;
        
            if (filter) {
                filterQuery = `WHERE recipes.title ILIKE '%${filter}%' OR chefs.name ILIKE '%${filter}%'`;
                totalQuery = `( SELECT count (*) FROM recipes ${filterQuery} ) AS total`;
            }
        
            query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS author
                FROM recipes
                LEFT JOIN chefs on (recipes.chef_id = chefs.id)
                ${filterQuery}
                ORDER BY updated_at DESC
                LIMIT $1 OFFSET $2`
            ;
        
            const results = await db.query(query, [limit, offset]);
            return results.rows;

        } catch (error) {
            console.error(error);
        }
    }
};
