export class Jobs {
    constructor(){
        this.jobListStart = {};
        this.jobListStop = {};
        this.saveJobStart = this.saveJobStart.bind(this);
        this.saveJobStop = this.saveJobStop.bind(this);
    }

    saveJobStart(jobId, job){
        // console.log("inside start save");
        // console.log("job id", jobId);
        // console.log("job", job);
        this.jobListStart[jobId] = job;
    }

    saveJobStop(jobId, job){
        // console.log("inside stop save");
        // console.log("job id", jobId);
        // console.log("job", job);
        this.jobListStop[jobId] = job;
    }
}