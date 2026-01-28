import express from "express";
import { Gitclone } from "../Controllers/GitController.js";
const router = express.Router();
router.get("/git", Gitclone);
export default router;
