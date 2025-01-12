import express from "express";
import cors from "cors";
import apiRouter from './routes/index.js'
import { PORT } from "./config/serverConfig.js";

const app = express();

app.use(express.json());// middleware
app.use(express.urlencoded());// middleware: request body ko accept kr skte hai
app.use(cors());// middleware


app.use('/api', apiRouter);

app.get("/ping", (req, res) => {
    return res.json({
        message: "pong"
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
}); 