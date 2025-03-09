import pool from "../config/db.js";
import { getProjectbyTitle } from "./Projects.js";
import { getUserbyName } from "./User.js";

export const addMember = async (p_name, u_name, role) => {
    const p_id = await getProjectbyTitle(p_name);
    const u_id = await getUserbyName(u_name);
    if(!p_id || !u_id){
        console.log("Project or User does not exist");
        return null;
    }
    try {
        const result = await pool.query("INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *", [p_id, u_id, role]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const getMemberbyName = async (u_name) => {
    try {
        const u_id = await getUserbyName(u_name);
        if(!u_id){
            console.log("Member does not exist");
            return null;
        }
        const result = await pool.query("SELECT * FROM project_members WHERE user_id = $1", [u_id]);
        return result.rows[0]?.user_id;
    } catch (error) {
        console.log(error);
    }
};

export const updateRole = async (u_name, role) => {
    try {
        const u_id = await getMemberbyName(u_name);
        if(!u_id){
            console.log("Member does not exist");
            return null;
        }
        const result = await pool.query("UPDATE project_members SET role = $1 WHERE user_id = $2", [role, u_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const deleteMember = async (u_name) => {
    try {
        const u_id = await getMemberbyName(u_name);
        if(!u_id){
            console.log("Member does not exist");
            return null;
        }
        const result = await pool.query("DELETE FROM project_members WHERE user_id = $1", [u_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
}; 