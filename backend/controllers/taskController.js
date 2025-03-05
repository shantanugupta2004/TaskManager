import { AddTask, updateStatus, deleteTasks, fetchTasks, getTaskbyTitle } from "../models/Tasks.js";
import { addPriority, updatePriority } from "../models/Priorities.js";

export const add = async (req, res) => {
    const {title, description, name, priority} = req.body;
    try {
        const taskId = await AddTask(title, description, name);
        console.log("Waiting before fetching the new task...");
        await new Promise((resolve) => setTimeout(resolve, 100));
        const confirmedTaskId = await getTaskbyTitle(title);
        if (!confirmedTaskId) {
            return res.status(400).json({ error: "Task was added but could not be retrieved" });
        }
        const priority_id = await addPriority(priority, title);
        if (!priority_id) {
            return res.status(400).json({ error: "Failed to add priority" });
        }
        console.log("Tasked added ", taskId);
        console.log("Priority added ", priority_id);
        res.json({ 
            message: "Task and priority added successfully", 
            taskId, 
            priority_id 
        });
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

export const updateP = async (req, res) => {
    const {priority, title} = req.body;
    try {
        const p_id = await updatePriority(priority, title);
        res.json({p_id});
    } catch (error) {
        console.log("Priority could not be updated", error)
        res.status(500).json({error: "Priority updation failed"})
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