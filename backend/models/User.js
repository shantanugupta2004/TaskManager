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

export const getUserbyName = async (Name) => {
    try {
        const result = await pool.query("SELECT id FROM users WHERE name = $1", [Name]);
        return result.rows[0]?.id;
    } catch (error) {
        console.log(error);
        return null;
    }
}; 

export const getUserbyemail = async (email) => {
    try {
        const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        return result.rows[0]?.id;
    } catch (error) {
        console.log(error);
        return null;
    }
}; 

export const updatePass = async (email, password) => {
    try {
        const u_id = await getUserbyemail(email);
        if(!u_id){
            console.log("User not found");
            return null;
        }
        const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2", [password, u_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const getNamebyemail = async (email) => {
    try {
        const result = await pool.query("SELECT name FROM users WHERE email = $1", [email]);
        return result.rows[0]?.name || null;
    } catch (error) {
        console.log(error);
    }

};