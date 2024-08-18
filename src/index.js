import express from 'express'
import dotenv from "dotenv"
import connectToDatabase from './database/connection.js'
import usersRoutes from "./routes/users.routes.js"

const app = new express()
dotenv.config();

app.use(express.json())

app.use("/users", usersRoutes)

app.listen(8080, ()=>{
    console.log("server running on port 8080")
    connectToDatabase()
})