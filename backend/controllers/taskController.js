import { AddTask, updateStatus, deleteTasks, fetchTasks } from "../models/Tasks.js";

export const add = async (req, res) => {
    const {title, description, name} = req.body;
    try {
        const taskId = await AddTask(title, description, name);
        console.log("Tasked added ", taskId)
        res.json({message: "Task added successfully"})
    } catch (error) {
        console.log("Task could not be added", error)
        res.status(500).json({error: "Task addition failed"})
    }
};

export const update = async (req, res) => {
    const {title, status} = req.body;
    try {
        const taskId = await updateStatus(title,status);
        res.json({taskId})
    } catch (error) {
        console.log("Task could not be updated", error)
        res.status(500).json({error: "Task updation failed"})
    }
};

export const deleteTask = async (req, res) =>{
    const {title} = req.body;
    try {
        const taskId = await deleteTasks(title);
        console.log("Task deleted successfully")
        res.json({taskId})
    } catch (error) {
        console.log("Task could not be deleted", error)
        res.status(500).json({error: "Task deletion failed"})
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await fetchTasks();
        res.json(tasks)
    } catch (error) {
        console.log("Tasks could not be fetched", error)
        res.status(500).json({error: "Failed to retrieve tasks"});
    }
};