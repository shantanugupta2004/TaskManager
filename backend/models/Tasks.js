import pool from "../config/db.js";
import { getUserbyName } from "./User.js";

export const AddTask  = async (title, description, name) => {
    try {
        const userID = await getUserbyName(name);
        if(!userID){
            console.log('User not found');
            return null;
        }
        const result = await pool.query(`INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, 'Pending', $3)`, [title, description, userID]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const getTaskbyTitle = async (title) => {
    try {
        const result = await pool.query('SELECT id FROM tasks WHERE title = $1', [title]);
        return result.rows[0]?.id;
    } catch (error) {
        console.log(error);
    }
};

export const updateStatus = async (title, status) => {
    try {
        const taskId = await getTaskbyTitle(title);
        if(!taskId){
            console.log('Task does not exist');
            return null;
        }
        const result = await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [status, taskId]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const deleteTasks = async (title) => {
    try {
        const taskId = await getTaskbyTitle(title);
        if (!taskId) {
            console.log('Task does not exist');
            return null;
        }
        const result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [taskId]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

export const fetchTasks = async () => {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    return result.rows;
}