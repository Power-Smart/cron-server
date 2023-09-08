import express from "express";
import {
    jobs,
    files
} from "./init.js";
import _ from "lodash";
import cron from "node-cron";
import axios from "axios";
import { webserverApi } from "./apis.js";

// routes
import mainRoute from "./routes/main.route.js";
import json from "body-parser/lib/types/json.js";

const app = express();

app.use(express.json());

const server = app.listen(4004, async function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log(
        "Cron server listening on http://%s:%s",
        host,
        port
    );

    const startJobsArr = await files.readEntry("startJobs");
    const stopJobsArr = await files.readEntry("startJobs");

    startJobsArr.forEach(element => {

        console.log("\x1b[33m ඇතුලෙ ඉන්නෙ... \x1b[0m");

        const jsonElement = JSON.parse(element);

        if (!_.isNull(jsonElement)) {

            const status = jsonElement.status;

            console.log(status);

            const { scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone } = jsonElement.reqBody;

            const jobFunc = async (scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone, status) => {

                try {

                    console.log('\x1b[33m inside job sync! \x1b[0m');

                    const reqBodyToSave = {

                        "scheduleId": scheduleId,
                        "startTime": startTime,
                        "endTime": endTime,
                        "startDay": startDay,
                        "endDay": endDay,
                        "switchingScheme": switchingScheme,
                        "timeZone": timeZone
                    }

                    console.log("inside create job begin");
                    console.log(startTime.split(":"));

                    const startString = startTime.split(":");
                    console.log(startString);
                    const stopString = endTime.split(":");

                    let cronStringStart = startString[1] + " " + startString[0] + " * * " + startDay;
                    console.log(cronStringStart);
                    let cronStringStop = stopString[1] + " " + stopString[0] + " * * " + endDay;
                    console.log(cronStringStop);

                    const cronJobStart = await cron.schedule(cronStringStart, async () => {
                        console.log('job started');
                        const webServerResponse = webserverApi.post('/devices/scheduledSwitch', switchingScheme);
                    }, {
                        scheduled: false,
                        timezone: timeZone
                    });

                    const jobToSaveStart = {
                        "id": scheduleId,
                        "reqBody": reqBodyToSave,
                        "jobString": cronStringStart,
                        "job": cronJobStart,
                        "status": true
                    };

                    // console.log(jobToSaveStart);

                    // if(!files.createEntry(scheduleId, "startJobs", JSON.stringify(jobToSaveStart))){
                    //     console.log("File not created");
                    //     throw new Error("File not created");
                    // }else{
                    //     console.log("Entry created");
                    // }

                    const switchingSchemeInvert = {};

                    for (const key in switchingScheme) {
                        if (switchingScheme.hasOwnProperty(key)) {
                            switchingSchemeInvert[key] = !switchingScheme[key];
                        }
                    }

                    const cronJobStop = await cron.schedule(cronStringStop, () => {
                        console.log('job started');
                        const webServerResponse = webserverApi.post('/devices/scheduledSwitch', switchingSchemeInvert);
                    }, {
                        scheduled: false,
                        timezone: [timeZone]
                    });

                    const jobToSaveStop = {
                        "id": scheduleId,
                        "reqBody": reqBodyToSave,
                        "jobString": cronStringStop,
                        "job": cronJobStop,
                        "status": true
                    };

                    // if(!files.createEntry(scheduleId, "stopJobs", JSON.stringify(jobToSaveStop))){
                    //     throw new Error("File not created");
                    // }

                    if (status) {
                        cronJobStart.start();
                        cronJobStop.start();
                    }

                    jobs.saveJobStart(scheduleId, cronJobStart);
                    jobs.saveJobStop(scheduleId, cronJobStop);

                    console.log("Job Created\n\n\n");

                } catch (error) {
                    console.log(error.message);
                }
            }

            jobFunc(scheduleId, startTime, endTime, startDay, endDay, switchingScheme, timeZone, status);

            // const statVar = ((status)=>(status?'active':'inactive'))(status);

            // const url = 'http://:::4004/createBegin/'+statVar;
            // console.log(url);

            // axios.post(url,jsonElement.reqBody).then((response)=>{
            //     console.log(response);
            // }).catch((error => {
            //     console.log(error.message);
            // }))

            // jobs.saveJobStart(jsonElement.id, jsonElement.job);
            // if(jsonElement.status){
            //     console.log(jobs.jobListStart[jsonElement.id]);
            //     cron.schedule(jobs.jobListStart[jsonElement.id]).start();
            // }
        }
    });

    // stopJobsArr.forEach(element => {

    //     const jsonElement = JSON.parse(element);

    //     if(!_.isNull(jsonElement)){

    //         // jobs.saveJobStop(jsonElement.id, jsonElement.job);
    //         // if(jsonElement.status){
    //         //     cron.schedule(jobs.jobListStop[jsonElement.id]).start();
    //         // }
    //     }
    // });

});

// routes
app.use("/", mainRoute);

