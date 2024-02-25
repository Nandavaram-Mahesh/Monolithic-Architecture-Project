import dotenv from 'dotenv'
import bunyan from 'bunyan'

dotenv.config({})


class Config{
    
    public MONGODB_URI:string|undefined 
    public SECRET_KEY_1:string
    public SECRET_KEY_2:string
    public DB_NAME:string|undefined
    public CORS_ORIGIN:string|undefined
    public SERVER_PORT:string 
    public NODE_ENV:string| undefined
    public REDIS_HOST:string|undefined
    public REDIS_PASSWORD:string|undefined
    public REDIS_PORT:string

    private readonly DEFAULT_MONGODB_URI = 'mongodb+srv://Mahesh:Mahesh@cluster0.igiqnws.mongodb.net'
    
    constructor(){

        this.MONGODB_URI = process.env.MONGODB_URI || this.DEFAULT_MONGODB_URI
        this.SECRET_KEY_1 = process.env.SECRET_KEY_1 ||'15733145'
        this.SECRET_KEY_2=process.env.SECRET_KEY_2 || '57643232'
        this.DB_NAME = process.env.DB_NAME || 'appDb'
        this.CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
        this.SERVER_PORT = process.env.SERVER_PORT || '8000'
        this.NODE_ENV = process.env.NODE_ENV
        this.REDIS_HOST = process.env.REDIS_HOST
        this.REDIS_PASSWORD = process.env.REDIS_PASSWORD
        this.REDIS_PORT = process.env.REDIS_PORT || '19934'
    }

    public createLogger(name:string):bunyan{
        return bunyan.createLogger({name,level:'debug'})
    }
    public validateConfig():void{
        console.log(this)
        for(const [key,value] of Object.entries(this)){
            if(value===undefined){
                throw new Error(`Env Variable ${key} is undefined`)
            }
        }
    }

}


export  const config:Config = new Config()