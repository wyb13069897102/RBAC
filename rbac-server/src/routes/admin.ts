import express,{ Router } from "express";
import * as staffContorller from '../controller/admin/staff'
import * as accessContorller from '../controller/admin/access'
import * as roleContorller from '../controller/admin/role'
import authAdminMiddleware from "../middleware/admin/authAdmin.middleware";
import roleAccessMiddleware from "../middleware/admin/roleAccess.middleware";
import rolesAccessMiddleware from "../middleware/admin/rolesAccess.middleware";
// 创建路由实例 路由模块化
const adminrouter:Router = express.Router()

// 登录
adminrouter.post('/staffs/login', staffContorller.staffLogin);
adminrouter.get('/staffs/currentStaff', authAdminMiddleware, staffContorller.currentStaff);
// , roleAccessMiddleware("role list")
// staff
adminrouter.get('/staffs', authAdminMiddleware, rolesAccessMiddleware("staff list"), staffContorller.staffList);
adminrouter.get('/staffs/:id', authAdminMiddleware, rolesAccessMiddleware("staff one"),  staffContorller.staffOne);
adminrouter.post('/staffs', authAdminMiddleware, rolesAccessMiddleware("staff save"),  staffContorller.staffSave);
adminrouter.put('/staffs/:id', authAdminMiddleware, rolesAccessMiddleware("staff update"),  staffContorller.staffUpdate);
adminrouter.post('/staffs/:id/role/:roleID', authAdminMiddleware, rolesAccessMiddleware("staff role"),  staffContorller.staffRole);
adminrouter.post('/staffs/:id/role', authAdminMiddleware, rolesAccessMiddleware("staff roles"),  staffContorller.staffRoles);

// role
adminrouter.get('/roles', authAdminMiddleware, rolesAccessMiddleware("role list"),  roleContorller.roleList);
adminrouter.post('/roles', authAdminMiddleware, rolesAccessMiddleware("role save"),  roleContorller.roleSave);
adminrouter.put('/roles/:id', authAdminMiddleware, rolesAccessMiddleware("role update"),  roleContorller.roleUpdate);
adminrouter.get('/roles/:id', authAdminMiddleware, rolesAccessMiddleware("role one"),  roleContorller.roleOne);
adminrouter.post('/roles/:id/accesss', authAdminMiddleware, rolesAccessMiddleware("role access"),  roleContorller.roleAccess);

// access
adminrouter.post('/accesss', authAdminMiddleware, rolesAccessMiddleware("access save"),  accessContorller.accessSave);
adminrouter.get('/accesss/:id', authAdminMiddleware, rolesAccessMiddleware("access one"),  accessContorller.accessOne);
adminrouter.delete('/accesss/:id', authAdminMiddleware, rolesAccessMiddleware("access delete"),  accessContorller.accessDelete);
adminrouter.get('/accesss', authAdminMiddleware, rolesAccessMiddleware("access list"),  accessContorller.accessList);
adminrouter.put('/accesss/:id', authAdminMiddleware, rolesAccessMiddleware("access update"),  accessContorller.accessUpdate);

export default adminrouter;