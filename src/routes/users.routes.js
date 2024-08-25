import { Router } from "express";
import { createUser, deleteUser, getUsers, loginUser, updateUserName } from "../controllers/users.controller.js";

const router = new Router()

router.get("/", getUsers)
router.post("/register", createUser )
router.post("/login", loginUser )
router.post("/updateName", updateUserName)
router.delete("/deleteUser/:id", deleteUser)


export default router