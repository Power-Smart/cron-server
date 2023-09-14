import express from "express";
import {
    mainController,
    mainControllerPost,
} from "../controller/main.controller.js";
import {
    createJobs,
    createJobsBegin
} from "../controller/create.controller.js";
import {
    updateJobs,
    toggleActivation
} from "../controller/update.controller.js";
import {
    deleteJobs
} from "../controller/delete.controller.js";


const router = express.Router();

router.get("/", mainController);
router.post("/", mainControllerPost);
router.post("/create", createJobs);
router.post("/createBegin/:status", createJobsBegin);
router.post("/update", updateJobs);
router.post("/delete", deleteJobs);
router.post("/toggle_activation", toggleActivation);

export default router;


//comment