import express, { application } from "express";
import { initDB } from './db/index.js'
import { toDosReqHandler } from "./handlers/todos.js";
import cors from "cors"
const port = 3000;
const api = express();

api.use(cors())
api.use(express.json());
api.use(express.urlencoded({ extended: false }))
api.use("/api/v1", toDosReqHandler)

api.listen(port, () => {
    console.log(
        `API IS LISTENING ON PORT: ${port}`
    )
    initDB().then(() => {
        console.log('DB IS READY :3')
    })
})