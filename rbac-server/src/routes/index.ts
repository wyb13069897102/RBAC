import express,{ Router } from "express";
import * as userContorller from '../controller/client/user'
import adminRouter from './admin'
// 创建路由实例 路由模块化
const router:Router = express.Router()
// 前台路由
router.post('/users/regist', userContorller.userRegist);
router.post('/users/login', userContorller.userLogin);
// 后台路由
router.use('/admin', adminRouter);

export default router;