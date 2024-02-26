import express,{Express} from 'express'
import {BonjoServer} from './setupServer'
import databaseConnection from './setupDatabase'
import {config} from './config'
class MonolithicApplication{

    public  initialize():void{
        this.loadConfig()
        databaseConnection()
        const app:Express = express()
        const server:BonjoServer = new BonjoServer(app)
        server.start() 
    }

    private loadConfig():void{
        config.validateConfig()
        config.cloudinaryConfig()
    }
}

const application:MonolithicApplication = new MonolithicApplication()
application.initialize()