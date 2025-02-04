import Docker from "dockerode";

const docker = new Docker();

export const listContainer = async () => {
    const container = await docker.listContainers();
    console.log("containers", container);
    container.forEach((containerInfo) => {
        console.log(containerInfo.Ports);
    })
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcp, head) => {
    console.log("project id received for container create", projectId);
    
    try {
        const container =  await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: "sandbox",
            ExposedPorts: {
                "5173/tcp" : {}
            },
            Env: ["HOST=0.0.0.0"],
            HostConfig: {
                Binds: [ // mouting the project derectory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0" // random port will be assign by docker
                        }
                    ]
                },
            }
        });

        console.log("container created", container.id);

        await container.start();
        
        console.log("container started");

        // Below is the place where we will upgrade the connection to websocket
        terminalSocket.handleUpgrade(req,  tcp, head, (establishedWSConn) => {
            console.log("connection upgrade to websocket")
            terminalSocket.emit("connection", establishedWSConn, req, container);
        })

    } catch (error) {
        console.log("error while creating container", error);
    }
}

