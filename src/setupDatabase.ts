import mongoose from 'mongoose'
import Logger from 'bunyan'
import {config} from './config'

const log:Logger = config.createLogger('database')

export default ()=>{
    const connectDb = async ()=>{
        try{

            const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}/${config.DB_NAME}`);
           log.info(
                `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
            );
            // The host typically represents the hostname or IP address of the server where the database is hosted
        } 
        catch(error){
            log.error("MongoDB connection error: ",error)
            process.exit(1)
        }
    } 
    connectDb()

    mongoose.connection.on('disconnect',connectDb)
}