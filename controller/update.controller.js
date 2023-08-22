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

        let cronStringStart = "";
        let cronStringStop = "";
        
        cronStringStart + startTime.getMinutes() + "" + startTime.getHours() + " * * " + startTime.getDay();
        console.log(cronStringStart);

        cronStringStart + endTime.getMinutes() + "" + endTime.getHours() + " * * " + endTime.getDay();
        console.log(cronStringStop);

        const cronJobStart =  await cron.schedule(cronStringStart, () =>  {
            
            const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingScheme);
          }, {
            scheduled: false
          });
          
          cronJobStart.start();

          const cronJobStop =  await cron.schedule(cronStringStop, () =>  {
            
            const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingScheme);
          }, {
            scheduled: false
          });
          
          cronJobStop.start();

          jobs.saveJobStart(scheduleId, cronJobStart);
          jobs.saveJobStop(scheduleId, cronJobStop);

          res.status(200).send("Job Updated");

    }catch(error){
        res.status(500).send(error.message);
    }
}
