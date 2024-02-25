import {Application,json,urlencoded,Response,Request,NextFunction} from 'express'
import http from 'http'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import cookieSession from 'cookie-session'
import HTTP_STATUS from 'http-status-codes'
import compression from 'compression'
import Logger from 'bunyan'
import {Server} from 'socket.io'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import { config } from './config'
import applicationRoutes from './routes'
import { CustomError, IErrorResponse } from './shared/globals/helpers/error-handler'
import 'express-async-errors'

const log:Logger = config.createLogger('server')

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
        applicationRoutes(app)
    }
    private globalErrorHandler(app:Application):void{
        /* This (app.all) catches the errors relared to bad url requests */
        app.all('*',(req:Request,res:Response)=>{
            res.status(HTTP_STATUS.NOT_FOUND).json({message:`${req.originalUrl} not found`})
        })
        
        app.use((error:IErrorResponse,req:Request,res:Response,next:NextFunction)=>{
            log.error(error)
            if(error instanceof CustomError){
                return res.status(error.statusCode).json(error.serialize())
            }
            next()

        })
    }
    private async startServer(app:Application):Promise<void>{
        try{
            const httpServer:http.Server = new http.Server(app)
            const socketIoServer:Server = await this.createSocketIO(httpServer)
            this.startHttpServer(httpServer)
            this.socketIoConnections(socketIoServer)
        }catch(e){
            log.error(e)
        }
    }
    private async createSocketIO(httpServer:http.Server):Promise<Server>{
        const io:Server=new Server(httpServer,{
            cors:{
                origin:config.CORS_ORIGIN,
                methods:['GET','PUT','POST','DELETE','OPTIONS']
            }
        })
        const pubClient = createClient({
            password: config.REDIS_PASSWORD,
            socket: {
                host: config.REDIS_HOST,
                port: parseInt(config.REDIS_PORT)
            }
        });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()])
        io.adapter(createAdapter(pubClient, subClient));
        io.listen(3000);
        return io
    }
    private startHttpServer(httpServer:http.Server):void{
        log.info(`This process is pid:${process.pid}`)
        httpServer.listen(config.SERVER_PORT,()=>{
            log.info(`httpServer running on the port:${config.SERVER_PORT}`)
        })
    }
    private socketIoConnections(io:Server):void{

    }
}