import express,{Express} from 'express'
import {BonjoServer} from '@root/setupServer'
import databaseConnection from '@root/setupDatabase'
import {config} from '@root/config'
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
    }
}

const application:MonolithicApplication = new MonolithicApplication()
application.initialize()