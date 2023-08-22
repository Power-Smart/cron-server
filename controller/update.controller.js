import {jobs} from "../init.js";
import axios from 'axios';
import cron from 'node-cron';


export const updateJobs = async (req,res) => {

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
        
        cronStringStart + startTime.getMinutes() + "" + startTime.getHours() + " * * " + startDay;
        console.log(cronStringStart);

        cronStringStart + endTime.getMinutes() + "" + endTime.getHours() + " * * " + endDay;
        console.log(cronStringStop);

        const cronJobStart =  await cron.schedule(cronStringStart, () =>  {
            
            const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingScheme);
          }, {
            scheduled: false
          });
          
          cronJobStart.start();

          const switchingSchemeInvert = {};
    
            for (const key in obj) {
                if (switchingScheme.hasOwnProperty(key)) {
                    switchingSchemeInvert[key] = !obj[key];
                }
            }

          const cronJobStop =  await cron.schedule(cronStringStop, () =>  {
            
            const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingSchemeInvert);
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
