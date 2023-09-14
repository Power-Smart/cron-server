import { jobs, files } from "../init.js";
import { webserverApi } from "../apis.js";
import axios from 'axios';
import cron from 'node-cron';


export const updateJobs = async (req, res) => {

	try {
		const { scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone, status } = req.body;

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
			"status": status
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
			"status": status
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

export const toggleActivation = async (req, res) => {
	try {
		const { scheduleId, status } = req.body;
		if (jobs.jobListStart.hasOwnProperty(scheduleId) && jobs.jobListStop.hasOwnProperty(scheduleId)) {
			const jobToSaveStart = JSON.parse(await files.readEntry("startJobs", scheduleId));
			const jobToSaveStop = JSON.parse(await files.readEntry("stopJobs", scheduleId));
			jobToSaveStart.status = status;
			jobToSaveStop.status = status;
			if (files.deleteEntry(scheduleId, "startJobs")
				&& files.deleteEntry(scheduleId, "stopJobs")) {
				if (!files.createEntry(scheduleId, "startJobs", JSON.stringify(jobToSaveStart))
					|| !files.createEntry(scheduleId, "stopJobs", JSON.stringify(jobToSaveStop))) {
					console.log("File not created");
					throw new Error("File not created");
				}
				console.log("Files created");
			} else {
				throw new Error("File not deleted");
			}

			const start = jobs.jobListStart[scheduleId];
			const stop = jobs.jobListStop[scheduleId];
			jobs.toggleActivation(scheduleId, status);
			if (status) {
				start.start();
				stop.start();
			} else {
				start.stop();
				stop.stop();
			}
			console.log("Job Toggled");
			res.status(200).send("Job Toggled");
		} else {
			throw new Error("No job found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}

}