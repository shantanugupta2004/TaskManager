import { CreateProject, deleteProject, fetchProjects, getProjectbyTitle } from "../models/Projects.js";
import { addMember } from "../models/Project_Members.js";

export const addProject = async (req, res) => {
    const {title, description, u_name} = req.body;
    try {
        const p_id = await CreateProject(title, description, u_name);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const confirmedId = await getProjectbyTitle(title);
        if(!confirmedId){
            return res.status(400).json({error: "Project added but could not be retrieved"});
        }
        const member_id = await addMember(title, u_name, "Owner");
        console.log("Project added: ", p_id);
        console.log("Memeber added: ", member_id);
        res.json({message: "Project and member added successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Project could not be added"});
    }
};

export const removeProject = async (req, res) => {
    const {title} = req.body;
    try {
        const p_id = await deleteProject(title);
        console.log("Project deleted successfully");
        res.json({p_id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Project could not be deleted"});
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await fetchProjects();
        res.json({projects});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Projects could not be fetched"});
    }
};

