import express from "express";
import cors from "cors";
import apiRouter from './routes/index.js'
import { PORT } from "./config/serverConfig.js";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import chokidar from 'chokidar';
import { handleEditorSocketEvent } from "./socketHandlers/editorHandler.js";

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


    handleEditorSocketEvent(socket, editorNamespace);

});




server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(process.cwd());
}); 


