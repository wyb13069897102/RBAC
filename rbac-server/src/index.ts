import express, { Express } from 'express';
import { notMatch } from './middleware/NotMatch.middleware'
import errormiddleware from './middleware/Error.middleware'
import router from './routes'
import mongoose from 'mongoose'
import config from './config'
import md5 from 'md5'
import Staff from './models/Staff';

// middlewares 
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

const app: Express = express();

// 日志, 记录行为
app.use(morgan('dev'))
// 安全中间件 : 非对称加密 + 对称加密 + 单向数据加密
app.use(helmet());
// 跨域 客户端: proxy, 服务端
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// 定义路由 路由模块化
app.use('/api', router);
// 404 notMatch中间件
app.use(notMatch);
// 错误处理中间件
app.use(errormiddleware);
// 启动数据库
// 所有的配置应该是动态的 不能写死: 方便不同的环境 开发 测试 线上 生产
const initDB = async () => {
    const mongodbURL = `${config.db.host}:${config.db.port}/${config.db.database}`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(mongodbURL, options);
    console.log('connect to mongodb success');
}
// 启动服务
const initServer = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        app.listen(7000, () => {
            console.log('server is running on 7000...');
        }).on("error", (error) => {
            console.log(error);
        })
    })
}
// 创建一个超级管理员
const initAdmin = async () => {
    try {
        const superConfig = config.superAdmin;
        // 用户名唯一
        const username = superConfig.username;
        const findSuperAdmin = await Staff.findOne({ username })
        if (findSuperAdmin) return;
        const password = md5(superConfig.password);
        const staff = new Staff({ username: username, password: password, isSuper: true });
        await staff.save();
        console.log('superAdmin create success');
    } catch (error) {
        console.log(error.message);
    }
}
const main = async () => {
    await initDB();
    await initAdmin();
    await initServer();
}
main();