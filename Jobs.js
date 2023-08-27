export class Jobs {
    constructor(){
        this.jobListStart = {};
        this.jobListStop = {};
        this.saveJobStart = this.saveJobStart.bind(this);
        this.saveJobStop = this.saveJobStop.bind(this);
    }

    saveJobStart(jobId, job){
        this.jobListStart[jobId] = job;
    }

    saveJobStop(jobId, job){
        this.jobListStop[jobId] = job;
    }
}