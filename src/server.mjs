#!/usr/bin/env node

/**
 * Module dependencies.
*/


import './utils/loadEnv.mjs' // should be first!
import app from './app.mjs'
import http from 'http'
import errorLoggerUtls from './utils/errorLogger.utls.mjs'

const mongoURL = process.env.MONGODB_URI
errorLoggerUtls(mongoURL)

/**
 *  database setup
 */
import mongoose from 'mongoose'

mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    })
    .catch((err) => {
        console.log('mongoDb is not connected: ')
        throw new Error(err.message)
    })

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Listening on ' + bind)
    // debug('Listening on ' + bind)
}
