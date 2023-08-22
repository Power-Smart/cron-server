import {jobs, cron} from "../init.js";
import _ from 'lodash';
import axios from 'axios';

export const createJobs = async (req,res) => {

    try{
        const {scheduleId, startTime, endTime, startDay, endDay, switchingScheme } = req.body;

        if(jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)){

            delete jobs.jobListStart[scheduleId];
            delete jobs.jobListStop[scheduleId];

        }else{
            throw new Error("No job found");
        }

    }catch(error){
        res.status(500).send(error.message);
    }
}
