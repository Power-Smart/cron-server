import {jobs, files} from "../init.js";
import axios from 'axios';
import cron from 'node-cron';


export const deleteJobs = async (req,res) => {

    try{
        const {scheduleId} = req.body;

        console.log("StartJobs", jobs.jobListStart);
        console.log("StopJobs", jobs.jobListStop);

        if(jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)){

            delete jobs.jobListStart[scheduleId];
            delete jobs.jobListStop[scheduleId];

            // files.deleteEntry(scheduleId, "startJobs");
            // files.deleteEntry(scheduleId, "stopJobs");

            if(!files.deleteEntry(scheduleId, "startJobs") || !files.deleteEntry(scheduleId, "stopJobs")){
                throw new Error("File not deleted");
            }

        }else{
            throw new Error("No job found");
        }
        res.status(200).send("Job Deleted");

    }catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    }
}
