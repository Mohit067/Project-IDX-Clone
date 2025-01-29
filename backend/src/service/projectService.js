import uuid4 from "uuid4";
import fs from 'fs/promises';
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import { execPromisified } from "../utils/execUtility.js";
import directoryTree from "directory-tree";
import path from "path";

export const createProjectService = async () => {

    //create a new id and then inside the project folder create a new folder with that id
    const projectId = uuid4();
    console.log("New project id is", projectId);

    await fs.mkdir(`./projects/${projectId}`);

    //after this call npm create vite command in the very newly created project folder
    const response = await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export const getProjectTreeService = async(projectId) => {

    const projectPath = path.resolve(`./projects/${projectId}`);
    const tree = directoryTree(projectPath);
    return tree;

}