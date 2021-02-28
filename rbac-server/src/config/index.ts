import 'dotenv/config'
// 开发环境配置
const dev_config = {
    db:{
        host:process.env.MONGODB_URL,
        port:process.env.MONGODB_PORT,
        database:process.env.MONGODB_DATEBASE
    },
    superAdmin:{
        username:process.env.SUPER_ADMIN_USERNAME as string,
        password:process.env.SUPER_ADMIN_PASSWORD!
    },
    auth:{
        adminPrivateKey: process.env.ADMIN_SECRET_KEY as string,
        indexPrivateKey: process.env.INDEX_SECRET_KEY as string
    }
}
// 测试环境配置
const test_config = {

}
// 生产环境配置
const product_config = {

}
const config = dev_config
export default config;

