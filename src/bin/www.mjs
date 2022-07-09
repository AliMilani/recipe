#!/usr/bin/env node

/**
 * Module dependencies.
 */

import dotenv from "dotenv";

dotenv.config();

import app from "../app.mjs";
import debug from "debug";
import http from "http";
import validateEnv from '../utils/validateEnv.mjs'
import errorLoggerUtls from '../utils/errorLogger.utls.mjs'

debug("node-youme:server");
validateEnv();
const mongoURL = process.env.MONGODB_URL
errorLoggerUtls(mongoURL)

/**
 *  database setup
 */
import mongoose from "mongoose";

mongoose
    .connect(mongoURL)
    .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
        console.log("mongoDb is not connected: ");
        throw new Error(err.message);
    });

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || "3001"
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
    debug("Listening on " + bind);
}