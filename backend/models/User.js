import pool from "../config/db.js";

export const CreateUser = async (name, email, hashedPass) => {
    try {
        const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, hashedPass]);
        return result.rows[0].id;
    } catch (error) {
        console.log(error);
    }
    
};

export const getUser = async (email) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};