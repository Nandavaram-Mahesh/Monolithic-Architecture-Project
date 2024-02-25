import mongoose from 'mongoose'
import { config } from './config';

export default ()=>{
    const connectDb = async ()=>{
        try{

            const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}/${config.DB_NAME}`);
            console.log(
                `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
            );
            // The host typically represents the hostname or IP address of the server where the database is hosted
        } 
        catch(error){
            console.log("MongoDB connection error: ",error)
            process.exit(1)
        }
    } 
    connectDb()

    mongoose.connection.on('disconnect',connectDb)
}