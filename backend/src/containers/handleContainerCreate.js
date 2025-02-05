import Docker from "dockerode";

const docker = new Docker();

// Function to list all running containers
export const listContainer = async () => {
    try {
        const containers = await docker.listContainers();
        console.log("Containers:", containers);
        containers.forEach((containerInfo) => {
            console.log(containerInfo.Ports);
        });
    } catch (error) {
        console.log("Error listing containers:", error);
    }
};

// Function to create and start a Docker container
export const handleContainerCreate = async (projectId) => {
    console.log("Project ID received for container creation:", projectId);

    try {
        // Check if a container with the same projectId exists
        const existingContainers = await docker.listContainers({
            filters: { name: [projectId] } // Proper filtering to check by name
        });

        if (existingContainers.length > 0) {
            console.log("Existing container found, removing...");
            const existingContainer = docker.getContainer(existingContainers[0].Id);
            await existingContainer.remove({ force: true });
        }

        // Create a new container
        const container = await docker.createContainer({
            Image: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ["/bin/bash"],
            name: projectId,
            Tty: true,
            User: "sandbox",
            ExposedPorts: { "5173/tcp": {} },
            Env: ["HOST=0.0.0.0"],
            HostConfig: {
                Binds: [
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app` // Mount project directory
                ],
                PortBindings: {
                    "5173/tcp": [{ HostPort: "0" }] // Assign a random port
                },
            },
        });

        console.log("Container created with ID:", container.id);
        await container.start();
        console.log("Container started");

        return container;
    } catch (error) {
        console.log("Error while creating container:", error);
    }
};

export async function getContainerPort(containrName){
    const container = await docker.listContainers({
        name: containrName
    });

    if(container.length > 0){
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        console.log("Container info", containerInfo);
        return containerInfo.NetworkSettings.Ports["5173/tcp"][0].HostPort;
    }
}