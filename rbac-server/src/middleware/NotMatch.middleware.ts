import { Request, Response, NextFunction} from 'express'
import HttpException from '../exceptions/http.exception'
export const notMatch = (req:Request, res:Response, next:NextFunction) => {
    // res.status(404).json({
    //     flag: false,
    //     msg: '您访问的页面不存在'
    // })
    const notMatchError:HttpException = new HttpException(404, '您访问的页面不存在');
    next(notMatchError);
}