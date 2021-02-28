import { Request, Response, NextFunction } from 'express'
import HttpException from '../../exceptions/http.exception';
import jwt from 'jsonwebtoken'
import config from '../../config';
import Staff from '../../models/Staff';
import { JWT_Payload_Admin } from '../../types/jwt'

const authAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers);
    // authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTUxNzhlMGI5NTI4NDIzNGFhZDAzNSIsImlhdCI6MTYxMjI1NjUxMSwiZXhwIjoxNjEyMjkyNTExfQ.dxuoTAyrTI4yM7od3MuWUgt9xVpuDZl9YDaZlcl6-Qc','user-agent': 'PostmanRuntime/7.26.8'
    // 验证 authorzation
    const authorzation = req.headers.authorization;
    if (!authorzation) {
        return next(new HttpException(401, 'authorzation 必须提供'));
    }
    // 获取 token
    const token = authorzation.split(' ')[1];
    if (!token) {
        return next(new HttpException(401, 'authorzation token 必须提供, 格式Bearer token'));
    }
    try {
        // 验证 token
        const jwtData = jwt.verify(token, config.auth.adminPrivateKey) as JWT_Payload_Admin;
        // console.log(jwtData); // { id: '6015178e0b95284234aad035', iat: 1612256511, exp: 1612292511 }
        // 验证 用户是否存在
        const staff = await Staff.findById(jwtData.id);
        if (staff) { // 存在
            req.staff = staff!;
            return next(); // 放过
        } else { // 不存在
            return next(new HttpException(401, '当前登录的 staff 不存在'));
        }
    } catch (error) {
        // jwt 验证失败 
        return next(new HttpException(401, 'token 无效 / 已过期', error.message));
    }





}
export default authAdminMiddleware;