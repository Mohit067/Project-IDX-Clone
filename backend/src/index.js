import express from "express";
import cors from "cors";
import apiRouter from './routes/index.js'
import { PORT } from "./config/serverConfig.js";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import chokidar from 'chokidar';
import { handleEditorSocketEvent } from "./socketHandlers/editorHandler.js";
import { handleContainerCreate } from "./containers/handleContainerCreate.js";

const app = express(); // it handle http request
const server = createServer(app); // handle webSocket request
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
});

app.use(express.json());// middleware
app.use(express.urlencoded());// middleware: request body ko accept kr skte hai
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

    handleEditorSocketEvent(socket, editorNamespace);

    // socket.on("disconnect", async () => {
    //     await watcher.close();
    //     console.log("editor disconnect");
    // });

});

const terminalNamespace = io.of('/terminal');

terminalNamespace.on("connection", (socket) => {
    console.log("terminal connected");

    let projectId = socket.handshake.query['projectId'];

    socket.on("shell-input", (data) => {
        console.log("Input recieved", data);
        terminalNamespace.emit("shell-output", data);
    });

    socket.on("disconnect",() => {
        console.log("terminal disconnected")
    });

    handleContainerCreate(projectId, socket);
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
}); 