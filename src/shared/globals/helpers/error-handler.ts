import HTTP_STATUS from 'http-status-codes'



export interface IErrorResponse{
    message:string
    statusCode:number
    status:string
    serialize():IError
}

export interface IError{
    message:string
    statusCode:number
    status:string
}


export abstract class CustomError extends Error{
    
    abstract status:string
    abstract statusCode:number

    constructor(message:string){
        super(message)
    }

    serialize():IError{
        return{
            message:this.message,
            status:this.status,
            statusCode:this.statusCode
        }
    }

}


export class BadRequestError extends CustomError{
    statusCode = HTTP_STATUS.BAD_REQUEST
    status = 'error'

    constructor(message:string){
        super(message)
    }
}

export class NotFoundError extends CustomError{
    statusCode = HTTP_STATUS.NOT_FOUND
    status = 'Not Found'

    constructor(message:string){
        super(message)
    }
}


export class NotAuthorizedError extends CustomError{
    statusCode = HTTP_STATUS.UNAUTHORIZED
    status = 'Unauthorized Error'

    constructor(message:string){
        super(message)
    }
}


export class FileTooLongError extends CustomError{
    statusCode = HTTP_STATUS.REQUEST_TOO_LONG
    status = 'error'

    constructor(message:string){
        super(message)
    }
}


export class ServerError extends CustomError{
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE
    status = 'error'

    constructor(message:string){
        super(message)
    }
}

export class RequestValidationError extends CustomError{
    statusCode = HTTP_STATUS.BAD_REQUEST
    status = 'error'

    constructor(message:string){
        super(message)
    }
}