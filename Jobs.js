export class Jobs {
    constructor(){
        this.jobListStart = {};
        this.jobListStop = {};
        this.saveJobStart = this.saveJobStart.bind(this);
        this.saveJobEnd = this.saveJobEnd.bind(this);
    }

    saveJobStart(jobId, job){
        this.jobListStart[jobId] = job;
    }

    saveJobEnd(jobId, job){
        this.jobListStop[jobId] = job;
    }
}