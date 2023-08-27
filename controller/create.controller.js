import {jobs} from "../init.js";
import axios from 'axios';
import cron from 'node-cron';


export const createJobs = async (req,res) => {

		try{
				const {scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone } = req.body;

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

					
					cronJobStart.start();

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
						timezone: [timeZone]
					});
					
					cronJobStop.start();

					jobs.saveJobStart(scheduleId, cronJobStart);
					jobs.saveJobStop(scheduleId, cronJobStop);

					res.status(200).send("Job Created");

		}catch(error){
				res.status(500).send(error.message);
		}
}
