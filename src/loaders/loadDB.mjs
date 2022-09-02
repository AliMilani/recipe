import mongoose from 'mongoose'

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    })
    .catch((err) => {
        console.info('mongoDb is not connected: ')
        throw new Error(err.message)
    })
