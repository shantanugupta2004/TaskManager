import pool from '../config/db.js';
import { getUserbyName } from './User.js';

export const CreateProject = async (title, description, u_name) =>{
    try {
        const owner = await getUserbyName(u_name);
        if(!owner){
            console.log("User not found");
            return null;
        }
        const result = await pool.query("INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3)", [title, description, owner]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getProjectbyTitle = async (title) => {
    try {
        const result = await pool.query("SELECT * FROM projects WHERE name = $1", [title]);
        if(!result){
            console.log("Project not found");
            return null;
        }
        return result.rows[0]?.id;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const deleteProject = async (title) => {
    try {
        const p_id = await getProjectbyTitle(title);
        if(!p_id){
            console.log("Project not found");
            return null;
        }
        const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [p_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const fetchProjects = async () => {
    try {
        const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
        return result.rows;
    } catch (error) {
        console.log(error);
    }
};