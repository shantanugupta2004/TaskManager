import pool from "../config/db.js";
import { getProjectbyTitle } from "./Projects.js";
import { getMemberbyName } from "./Project_Members.js";

export const AddPTask = async (p_title, title, description, t_status, t_priority, u_name) => {
    try {
        const p_id = await getProjectbyTitle(p_title);
        const u_id = getMemberbyName(u_name);
        if(!p_id || !u_id){
            console.log("Either project or user does not exist");
            return null;
        }
        const result = await pool.query("INSERT INTO project_tasks (title, description, status, priority, project_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)", [title, description, t_status, t_priority, p_id, u_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);        
    }
};

export const getPTaskbyTitle = async (title) => {
    try {
        const result = await pool.query("SELECT * FROM project_tasks WHERE title = $1", [title]);
        return result.rows[0]?.id;
    } catch (error) {
        console.log(error);
    }
};

export const updatePStatus = async (title, p_status) => {
    try {
        const t_id = await getPTaskbyTitle(title);
        if(!t_id){
            console.log("Task deos not exist");
            return null;
        }
        const result = await pool.query("UPDATE project_tasks SET status = $1 WHERE id = $2", [p_status, t_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const updatePPriority = async (title, priority) => {
    try {
        const t_id = await getPTaskbyTitle(title);
        if(!t_id){
            console.log("Task deos not exist");
            return null;
        }
        const result = await pool.query("UPDATE project_tasks SET priority = $1 WHERE id = $2", [priority, t_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const deletePTasks = async (title) => {
    try {
        const t_id = await getPTaskbyTitle(title);
        if(!t_id){
            console.log("Task deos not exist");
            return null;
        }
        const result = await pool.query("DELETE FROM project_tasks WHERE id = $1 RETURNING *", [t_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};