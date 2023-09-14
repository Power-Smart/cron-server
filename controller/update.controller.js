import { jobs, files } from "../init.js";
import { webserverApi } from "../apis.js";
import axios from 'axios';
import cron from 'node-cron';


export const updateJobs = async (req, res) => {

	try {
		const { scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone } = req.body;

		console.log(req.body);
		if (jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)) {
			const start = jobs.jobListStart[scheduleId];
			const stop = jobs.jobListStop[scheduleId];

			delete jobs.jobListStart[scheduleId];
			delete jobs.jobListStop[scheduleId];

			if (!files.deleteEntry(scheduleId, "startJobs") || !files.deleteEntry(scheduleId, "stopJobs")) {
				throw new Error("File not deleted");
			}

			start.stop();
			stop.stop();

		} else {
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

		const cronJobStart = cron.schedule(cronStringStart, () => {
			console.log('job started');
			try {
				webserverApi.post('/devices/scheduledSwitch/', switchingScheme);
			} catch (error) {
				console.log(error.message);
			}
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

		if (!files.createEntry(scheduleId, "startJobs", JSON.stringify(jobToSaveStart))) {
			throw new Error("File not created");
		}

		const switchingSchemeInvert = {};

		for (const key in switchingScheme) {
			if (switchingScheme.hasOwnProperty(key)) {
				switchingSchemeInvert[key] = !switchingScheme[key];
			}
		}

		const cronJobStop = cron.schedule(cronStringStop, () => {
			console.log('job stopped');
			try {
				webserverApi.post('/devices/scheduledSwitch/', switchingSchemeInvert);
			} catch (error) {
				console.log(error.message);
			}
		}, {
			scheduled: false,
			timezone: timeZone
		});

		const jobToSaveStop = {
			"id": scheduleId,
			"reqBody": req.body,
			"jobString": cronStringStop,
			"job": cronJobStop,
			"status": true
		};

		if (!files.createEntry(scheduleId, "stopJobs", JSON.stringify(jobToSaveStop))) {
			throw new Error("File not created");
		}

		cronJobStart.start();
		cronJobStop.start();

		console.log("Job updated");

		jobs.saveJobStart(scheduleId, cronJobStart);
		jobs.saveJobStop(scheduleId, cronJobStop);

		res.status(200).send("Job updated");


	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
}
