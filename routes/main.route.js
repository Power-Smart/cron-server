import express from "express";
import {
    mainController,
    mainControllerPost,
} from "../controller/main.controller.js";

const router = express.Router();

router.get("/", mainController);
router.post("/", mainControllerPost);

export default router;
