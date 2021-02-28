import { Request, Response, NextFunction } from 'express'
export const userRegist = (req:Request, res:Response, next:NextFunction) => {
    res.json({
        isOk: true,
        data: {
            msg: 'user regist'
        }
    })
}
export const userLogin = (req:Request, res:Response, next:NextFunction) => {
    res.json({
        isOk: true,
        data: {
            msg: 'user login'
        }
    })
}