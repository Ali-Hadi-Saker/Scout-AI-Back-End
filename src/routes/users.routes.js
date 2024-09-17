import { Router } from "express";
import { changUserPassword, createUser, deleteUser, getUsers, loginUser, logoutUser, updateUserName } from "../controllers/users.controller.js";

const router = new Router()

router.get("/", getUsers)
router.get("/logout/:id", logoutUser)
router.post("/register", createUser )
router.post("/login", loginUser )
router.post("/updateName", updateUserName)
router.post("/changePassword", changUserPassword)
router.delete("/deleteUser/:id", deleteUser)


export default router