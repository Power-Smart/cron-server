import {jobs} from "../init.js";
import axios from 'axios';
import cron from 'node-cron';


export const deleteJobs = async (req,res) => {

    try{
        const {scheduleId} = req.body;

        if(jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)){

            delete jobs.jobListStart[scheduleId];
            delete jobs.jobListStop[scheduleId];

        }else{
            throw new Error("No job found");
        }
        res.status(200).send("Job Deleted");

    }catch(error){
        res.status(500).send(error.message);
    }
}
