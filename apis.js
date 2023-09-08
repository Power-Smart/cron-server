import axios from "axios";
import env from 'dotenv';
env.config();

const URL = `${process.env.WEB_SERVER_API}:${process.env.WEB_SERVER_PORT}`;

export const webserverApi = axios.create({
    baseURL: URL,
});