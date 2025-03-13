import { addMember, updateRole, deleteMember, getAllProjectMembers, getMemberNames } from "../models/Project_Members.js";

export const addM = async (req, res) => {
    const {p_name, u_name, role} = req.body;
    try {
        const m_id = await addMember(p_name, u_name, role);
        console.log("Member added successfully");
        res.json({m_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Member could not be added"});
    }
};

export const updateR = async (req, res) => {
    const {u_name, role} = req.body;
    try {
        const m_id = await updateRole(u_name, role);
        console.log("Role updated successfully");
        res.json({m_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Role could not be updated"});
    }
};

export const deleteM = async (req, res) => {
    const {u_name} = req.body;
    try {
        const m_id = await deleteMember(u_name);
        console.log("Member deleted successfully");
        res.json({m_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Member could ot be deleted"});
    }
};

export const fetchM = async (req, res) => {
    const {title} = req.body;
    try {
        const members = await getAllProjectMembers(title);
        res.json({members});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Members could not be fetched"});
    }
};

export const getNames = async (req, res) => {
    const {u_id} = req.body;
    try {
        const name = await getMemberNames(u_id);
        res.json({name});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Names could not be fetched"});
    }
};