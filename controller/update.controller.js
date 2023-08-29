import {jobs} from "../init.js";
import axios from 'axios';
import cron from 'node-cron';


export const updateJobs = async (req,res) => {

    try{
        const {scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone } = req.body;

        if(jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)){

            delete jobs.jobListStart[scheduleId];
            delete jobs.jobListStop[scheduleId];

            if(!files.deleteEntry(scheduleId, "startJobs") || !files.deleteEntry(scheduleId, "stopJobs")){
                throw new Error("File not deleted");
            }

        }else{
            throw new Error("No job found");
        }

        console.log(startTime.split(":"));

		const startString = startTime.split(":");
		console.log(startString);
		const stopString = endTime.split(":");

		let cronStringStart = startString[1] + " " + startString[0] + " * * " + startDay;
		console.log(cronStringStart);
		let cronStringStop = stopString[1] + " " + stopString[0] + " * * " + endDay;
		console.log(cronStringStop);

		const cronJobStart =  await cron.schedule(cronStringStart, () =>  {
			console.log('job started');
			const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingScheme);
		}, {
			scheduled: false,
			timezone: [timeZone]
		});

		const jobToSaveStart = {
			"id": scheduleId,
			"job": cronJobStart,
			"status": true
		};	

		if(!files.createEntry(scheduleId, "startJobs", JSON.parse(jobToSaveStart))){
			throw new Error("File not created");
		}

		const switchingSchemeInvert = {};

			for (const key in switchingScheme) {
					if (switchingScheme.hasOwnProperty(key)) {
							switchingSchemeInvert[key] = !switchingScheme[key];
					}
			}

		const cronJobStop =  await cron.schedule(cronStringStop, () =>  {
			console.log('job started');
			const webServerResponse =  axios.post('/deviceSwitchFunction/', switchingSchemeInvert);
		}, {
			scheduled: false,
			timezone: timeZone
		});

		const jobToSaveStop = {
			"id": scheduleId,
			"job": cronJobStop,
			"status": true
		};	

		if(!files.createEntry(scheduleId, "stopJobs", JSON.parse(jobToSaveStop))){
			throw new Error("File not created");
		}
		
		cronJobStart.start();
		cronJobStop.start();

		jobs.saveJobStart(scheduleId, cronJobStart);
		jobs.saveJobStop(scheduleId, cronJobStop);

		res.status(200).send("Job Created");


    }catch(error){
        res.status(500).send(error.message);
    }
}
