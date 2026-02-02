import express from "express";
import { Gitclone } from "../Controllers/GitController.js";
import { validateAndPrepare } from "../Middleware/RepoValidator.js";

const router = express.Router();

// Chain: Validate input -> Then run Controller
router.post("/git", validateAndPrepare, Gitclone);

export default router;
