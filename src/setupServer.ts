import {Application,json,urlencoded,Response,Request,NextFunction} from 'express'
import http from 'http'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import cookieSession from 'cookie-session'
import HTTP_STATUS from 'http-status-codes'
import compression from 'compression'

import 'express-async-errors'
import { config } from './config'



export class BonjoServer {

    private app:Application

    constructor(app:Application){
        this.app = app
    }

    public start():void{
        this.securityMiddleware(this.app)
        this.routesMiddleware(this.app)
        this.standardyMiddleware(this.app)
        this.globalErrorHandler(this.app)
        this.startServer(this.app)

    }
    private securityMiddleware(app:Application):void{
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_1,config.SECRET_KEY_2],
                // Cookie Options
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                secure:config.NODE_ENV !='development'
              }
            )
        )
        app.use(hpp())
        app.use(helmet())
        app.use(cors({
            origin:config.CORS_ORIGIN,
            credentials:true,
            optionsSuccessStatus:200,
            methods:['GET','PUT','POST','DELETE','OPTIONS']

        }))
    }
    private standardyMiddleware(app:Application):void{
        app.use(compression())
        app.use(json({limit:'50mb'}))
        app.use(urlencoded({extended:true,limit:'50mb'}))

    }
    private routesMiddleware(app:Application):void{

    }
    private globalErrorHandler(app:Application):void{

    }
    private async startServer(app:Application):Promise<void>{
        try{
            const httpServer:http.Server = new http.Server(app)
            this.startHttpServer(httpServer)
        }catch(e){
            console.log(e)
        }
    }
    private createSocketIO(httpServer:http.Server):void{

    }
    private startHttpServer(httpServer:http.Server):void{
        httpServer.listen(config.SERVER_PORT,()=>{
            console.log(`httpServer running on the port:${config.SERVER_PORT}`)
        })
    }
}