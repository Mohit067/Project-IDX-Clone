import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject"
import { Button, Layout  } from "antd";

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)',
};

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};
  
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};
  
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};
  
export const CreateProject = () => {

    const { Header, Footer, Content } = Layout;

    const navigate = useNavigate();

    const { createProjectMutation, isPending } = useCreateProject();
    async function handleCreateProject() {
        console.log("goind to trigger api");
        try {
            const response = await createProjectMutation();
            console.log("Now we should redirect to the editor");
            navigate(`/project/${response.data}`)
        } catch (error) {
            console.log("Error in creating project", error);
        }
    }
    return (

        <Layout style={layoutStyle}>
            <Header style={headerStyle}>Create Project</Header>
            <Content style={contentStyle}>
                <Button 
                    onClick={handleCreateProject}    
                >
                    Create Playground
                </Button>
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
        
    )
}