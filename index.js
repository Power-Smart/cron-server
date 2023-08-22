import express from "express";
import { jobs } from "./init.js";

// routes
import mainRoute from "./routes/main.route.js";
import json from "body-parser/lib/types/json.js";

const app = express();
app.use(express.json());

const server = app.listen(4003, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(
        "Cron server listening on http://%s:%s",
        host,
        port
    );
});

// routes
app.use("/", mainRoute);

