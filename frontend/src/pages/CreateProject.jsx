import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject";
import { FaReact } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAllPorject } from "../apis/projects";
import './CreateProject.css'



export const CreateProject = () => {
const [projectList, setProjectList] = useState([]);
const navigate = useNavigate();
const { createProjectMutation } = useCreateProject();

const handleCreateProject = async () => {
  try {
    const response = await createProjectMutation();
    navigate(`/project/${response.data}`);
  } catch (err) {
    console.error("Failed to create project:", err);
  }
};

useEffect(() => {
  const fetchProjects = async () => {
      try {
      const projects = await getAllPorject();
      setProjectList(projects || []);
      } catch (error) {
      console.error("Error fetching projects:", error);
      }
  };
  fetchProjects();
  }, []);

  function handleNavigateToProject(projectId){
    navigate(`/project/${projectId}`);
}

return (
  <div className="page">
    <div className="container">
          <div className="left-panel">
            <FaReact className="icon" />
            <button className="create-button" onClick={handleCreateProject}>
              Create Playground
            </button>
          </div>
          <div style={{ width: 300 }}>
      <h3 style={{ marginBottom: 16 }}>🗂️ Previous Projects</h3>
      <ul>
          {projectList.length > 0 ? (
              projectList.map((projectId, index) => (
                  <li
                      key={index}
                      className="project-item"
                      onClick={() => handleNavigateToProject(projectId)}
                      aria-label={`Navigate to project with ID ${projectId}`}
                  >
                      <FaFolder /> Project ID: {projectId}
                  </li>
              ))
          ) : (
              <div className="no-poject-message">No Project Found</div>
          )} 
      </ul>
      </div>
    </div>
  </div>
);
};

