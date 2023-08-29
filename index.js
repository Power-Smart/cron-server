import express from "express";
import { 
    jobs,
    files
    } from "./init.js";
import _ from "lodash";

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

        const jsonElement = JSON.parse(element);
        
        if(!_.isNull(jsonElement)){

            jobs.saveJobStart(jsonElement.id, jsonElement.job);
            if(jsonElement.status){
                console.log(jobs.jobListStart[jsonElement.id]);
                jobs.jobListStart[jsonElement.id].start();
            }
        }
    });

    stopJobsArr.forEach(element => {
        
        const jsonElement = JSON.parse(element);

        if(!_.isNull(jsonElement)){

            jobs.saveJobStop(jsonElement.id, jsonElement.job);
            if(jsonElement.status){
                jobs.jobListStop[jsonElement.id].start();
            }
        }
    });

});

// routes
app.use("/", mainRoute);

