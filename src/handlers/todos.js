import express, { response } from "express";
import { getDBHandler } from "../db/index.js"

const toDosReqHandler = express.Router();

toDosReqHandler.post('/to-dos', async (request, response) => {
    try {
        const { title, description, isDone: is_done } = request.body;
        const dbHandler = await getDBHandler();

        const newTodo = await dbHandler.run(`
        INSERT INTO todos(title, description, is_done)
        VALUES (
            '${title}',
            '${description}',
            ${is_done}
        )
        `);

        await dbHandler.close();

        response.send({ newTodo: { title, description, is_done, ...newTodo } })
    } catch (error) {
        response.status(500).send({
            error: `Something went wrong when trying to create a new to do`,
            errorInfo: error.message
        })
    }
})

toDosReqHandler.get('/to-dos', async (request, response) => {
    try {
        const dbHandler = await getDBHandler();

        const todos = await dbHandler.all('SELECT * FROM todos')

        await dbHandler.close();
        if (!todos || !todos.length) {
            return response.status(404).send({ message: "To Dos not Found" })
        }
        response.send({ todos })
    } catch (error) {
        response.status(500).send({
            error: `Something went wrong when trying to gets to dos`,
            errorInfo: error.message
        })
    }
})

toDosReqHandler.delete('/to-dos/:id', async (request, response) => {
    try {
        const todoId = request.params.id;

        const dbHandler = await getDBHandler();

        const deletedToDo = await dbHandler.run(
            'DELETE FROM todos WHERE id = ?',
            todoId
        );

        await dbHandler.close();

        response.send({ toDoRemoved: { ...deletedToDo } })
    } catch (error) {
        response.status(500).send({
            error: `Something went wrong when trying to remove a to do`,
            errorInfo: error.message
        })
    }
})

toDosReqHandler.patch('/to-dos/:id', async (request, response) => {
    try {
        const id = request.params.id
        const { title, description, isDone: is_done } = request.body;
        const dbHandler = await getDBHandler()

        const updateToDo = await dbHandler.get(`
            SELECT * FROM todos WHERE id = ?
        `, id)

        dbHandler.run(`
            UPDATE todos SET title = ?, description = ?, is_done = ? WHERE id = ?
            `,
            title || updateToDo.title,
            description || updateToDo.description,
            is_done || updateToDo.is_done,
            id)

        await dbHandler.close()

        response.send({ updateToDo: { ...updateToDo, title, description, is_done } })
    } catch (error) {
        response.status(500).send({
            error: `Something went wrong when trying to update a to do`,
            errorInfo: error.message
        })
    }
})

export { toDosReqHandler }
