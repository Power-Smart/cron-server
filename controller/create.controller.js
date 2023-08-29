import {jobs, files} from "../init.js";
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
			timezone: timeZone
		});

		const jobToSaveStart = {
			"id": scheduleId,
			"reqBody": req.body,
			"jobString": cronStringStart,
			"job": cronJobStart,
			"status": true
		};	

		console.log(jobToSaveStart);

		if(!files.createEntry(scheduleId, "startJobs", JSON.stringify(jobToSaveStart))){
			console.log("File not created");
			throw new Error("File not created");
		}else{
			console.log("Entry created");
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
			timezone: [timeZone]
		});

		const jobToSaveStop = {
			"id": scheduleId,
			"reqBody": req.body,
			"jobString": cronStringStop,
			"job": cronJobStop,
			"status": true
		};	

		if(!files.createEntry(scheduleId, "stopJobs", JSON.stringify(jobToSaveStop))){
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

export const createJobsBegin = async (req,res) => {

	try{

		console.log("inside create job begin");

		const status = req.params.status;
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
			timezone: timeZone
		});

		const jobToSaveStart = {
			"id": scheduleId,
			"reqBody": req.body,
			"jobString": cronStringStart,
			"job": cronJobStart,
			"status": true
		};	

		console.log(jobToSaveStart);

		if(!files.createEntry(scheduleId, "startJobs", JSON.stringify(jobToSaveStart))){
			console.log("File not created");
			throw new Error("File not created");
		}else{
			console.log("Entry created");
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
			timezone: [timeZone]
		});

		const jobToSaveStop = {
			"id": scheduleId,
			"reqBody": req.body,
			"jobString": cronStringStop,
			"job": cronJobStop,
			"status": true
		};	

		if(!files.createEntry(scheduleId, "stopJobs", JSON.stringify(jobToSaveStop))){
			throw new Error("File not created");
		}
		
		if(status === "active"){
			cronJobStart.start();
			cronJobStop.start();
		}
		
		jobs.saveJobStart(scheduleId, cronJobStart);
		jobs.saveJobStop(scheduleId, cronJobStop);

		res.status(200).send("Job Created");

	}catch(error){
		res.status(500).send(error.message);
	}
}

