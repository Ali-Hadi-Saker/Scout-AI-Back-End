import { Router } from "express";
import { createUser, getUsers, loginUser, updateUserName } from "../controllers/users.controller.js";

const router = new Router()

router.get("/", getUsers)
router.post("/register", createUser )
router.post("/login", loginUser )
router.post("/updateName", updateUserName)


export default router