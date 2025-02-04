import express from "express";
import cors from "cors";
import apiRouter from './routes/index.js'
import { PORT } from "./config/serverConfig.js";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import chokidar from 'chokidar';
import { handleEditorSocketEvent } from "./socketHandlers/editorHandler.js";
import { handleContainerCreate, listContainer } from "./containers/handleContainerCreate.js";
import { WebSocketServer } from "ws";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";

const app = express(); // it handle http request
const server = createServer(app); // handle webSocket request
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());// middleware
app.use(express.urlencoded({ extended: true }));// middleware: request body ko accept kr skte hai
app.use(cors());// middleware


app.use('/api', apiRouter);

app.get("/ping", (req, res) => {
    return res.json({
        message: "pong"
    });
});

const editorNamespace = io.of('/editor');

editorNamespace.on("connection", (socket) => {
    console.log("editor connected");
    
    //somehow we will get the project it from fronted
    let projectId = socket.handshake.query['projectId'];

    console.log("project id received after connection", projectId);

    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true, /** keeps the watcher in running time till your application is running */

            awaitWriteFinish: {
                stabilityThreshold: 2000 /** Ensure the stability of files before triggering event */
            },
            ignoreInitial: true, /** Ignore the initial file in the directory */ 
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        });
    }

    socket.on("getPort", () => {
        console.log("get port event  recieved");
        listContainer();
    })

    handleEditorSocketEvent(socket, editorNamespace);

});


    

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(process.cwd());
}); 


const webSocketForTerminal = new WebSocketServer({ noServer: true });  // we will hadle the upgragde event

webSocketForTerminal.on("connection", (ws, req, container) => {
    console.log("terminal connect",container);
    handleTerminalCreation(container, ws);

    

    ws.on("close", () => {
        container.remove({ force: true }, (err, data) => {
            if(err){
                console.log("Error while removing the container", err);
            }
            console.log("container removed", data);
        });
    })
});

server.on("upgrade", (req, tcp, head) => {  // Raise the fronted request
    /**
     * req: Incoming http request
     * socket: TCP socket
     * head: Buffer containing the first package of the upgraded stream
     */
    //this callback will be called when client tries to connect to the server through wesocketServer

    const isTerminal = req.url.includes('/terminal');

    if(isTerminal){
        console.log("Request url recieved", req.url);
        let projectId = req.url.split("=")[1];
        console.log("Project id recieved after connection", projectId);

        handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
    }
});

