import { Jobs } from "./Jobs.js";
import cron from 'node-cron';

export const jobs = new Jobs();
export const cron = new cron();

