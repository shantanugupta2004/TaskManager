import pool from "../config/db.js";
import { getTaskbyTitle, getUserid} from "./Tasks.js";

export const addPriority = async (priority, title) => {
    const t_id = await getTaskbyTitle(title);
    const u_id = await getUserid(title);  // Ensure this is correct

    console.log("Task ID:", t_id, "User ID:", u_id, "Priority:", priority);

    if (!t_id || !u_id) {
        console.log("Task or User does not exist, cannot add priority.");
        return null;
    }

    try {
        const result = await pool.query(
            "INSERT INTO priorities (priority, task_id, u_id) VALUES ($1, $2, $3) RETURNING *", 
            [priority, t_id, u_id]
        );
        console.log("Priority Insert Result:", result.rows);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting priority:", error);
        return null;
    }
};


export const updatePriority = async (priority, title) => {
    const t_id = await getTaskbyTitle(title);
    if(!t_id){
        console.log("Task does not exist");
        return null;
    }
    try {
        const result = await pool.query("UPDATE priorities SET priority = $1 WHERE task_id = $2", [priority, t_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};