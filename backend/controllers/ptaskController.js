import { AddPTask, updatePPriority, updatePStatus, deletePTasks, fetchPTasks } from "../models/Project_Tasks.js";

export const add = async (req, res) => {
    const {p_title, title, description, status, priority, name} = req.body;
    try {
        const pt_id = await AddPTask(p_title, title, description, status, priority, name);
        console.log("Project task added");
        res.json({pt_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Task could not be added"});
    }
};

export const updateP = async (req, res) => {
    const {title, priority} = req.body;
    try {
        const p_id = await updatePPriority(title, priority);
        console.log("Priority updated successfully");
        res.json({p_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Priority could not be updated"});
    }
};

export const updateS = async (req, res) => {
    const {title, status} = req.body;
    try {
        const p_id = await updatePStatus(title, status);
        console.log("Status updated successfully");
        res.json({p_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Status could not be updated"});
    }
};

export const deleteT = async (req, res) => {
    const {title}= req.body;
    try {
        const pt_id = await deletePTasks(title);
        console.log("Task deleted successfully");
        res.json({pt_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Task could not be deleted"});
    }
};

export const getT = async (req, res) => {
    const {title}= req.body;
    try {
        const tasks = await fetchPTasks(title);
        res.json({tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Tasks could not be fetched"});
    }
};

