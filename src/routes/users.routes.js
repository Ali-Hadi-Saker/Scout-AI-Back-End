import { Router } from "express";
import { createUser, getUsers } from "../controllers/users.controller.js";

const router = new Router()

router.get("/", getUsers)
router.post("/register", createUser )

export default router