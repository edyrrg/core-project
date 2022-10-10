import express from "express";
import { initDB } from './db/index.js'
import { toDosReqHandler } from "./handlers/todos.js";
const port = 8080;
const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: false }))
api.use("/v1", toDosReqHandler)

api.listen(port, () => {
    console.log(
        `API IS LISTENING ON PORT: ${port}`
    )
    initDB().then(()=>{
        console.log('DB IS READY :3')
    })
})