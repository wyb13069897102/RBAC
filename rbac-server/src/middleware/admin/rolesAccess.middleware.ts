import { Request, Response, NextFunction } from 'express'
import HttpException from '../../exceptions/http.exception';
import Staff from '../../models/Staff';
import Role, { IRoleDocument } from '../../models/Role';


const rolesAccessMiddleware = (allowAccess: string /*allowRoles: string[]*/) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let staff = req.staff!;
            // 超级管理员 登录需要验证, 权限不需要验证 直接放行
            if (staff.isSuper) next();
            // console.log('staff : ',staff);

            // 1.参数是权限数组
            // // 单角色
            // // 当前用户的角色
            // const staffRole = await Role.findById(staff.role).populate('accesss');
            // // console.log('staffRole : ',staffRole);
            // if (!staffRole) {
            //     return next(new HttpException(403, '1 --- this staff has\'nt role or role has been limited!!!'));
            // }
            // // 获取当前用户的所有权限 ( staff - role - accesss ) 
            // const staffAccess = staffRole.accesss.map(item => {
            //     return item.name;
            // });
            // const checksAccess = staffAccess.some(item => {
            //     return allowAccess.indexOf(item) !== -1
            // })
            // if (checksAccess) {
            //     return next();
            // } else {
            //     return next(new HttpException(403, '2 --- this staff has\'nt role to watch staff list !!!'));
            // }

            // 2.参数是角色数组
            // // 多角色层级判断
            // const staffWithRoles = await Staff.findById(staff._id).populate('roles');
            // const staffRoles = staffWithRoles!.roles;
            // if (!staffRoles || staffRoles.length < 0) {
            //     return next(new HttpException(403, '1 --- this staff has\'nt role or role has been limited!!!'));
            // }
            // // 比较算法
            // const staffRoleNames = staffRoles.map(item => item.name);
            // const checkStaffRoles = allowRoles.some( allowRoleName => {
            //     return staffRoleNames.indexOf(allowRoleName) !== -1;
            // })
            // if (checkStaffRoles) {
            //     return next();
            // } else {
            //     return next(new HttpException(403, '2 --- this staff has\'nt role to watch staff list !!!'));
            // }

            // 3. allowAccesss: string[]
            // 多角色 权限层级判断
            const staffWithRoles = await Staff.findById(staff._id).populate('roles');
            const staffRoles:IRoleDocument[] = staffWithRoles!.roles;
            if (!staffRoles || staffRoles.length < 1) {
                return next(new HttpException(403, '3 --- this staff has\'nt role or role has been limited!!!'));
            }
            // 当前用户所有角色的所有权限
            let staffAccessNames:string[] = [];
            for (let i = 0; i < staffRoles.length; i++) {
                const staffRole = staffRoles[i];
                const roleWithAccess = await Role.findById(staffRole._id).populate('accesss');
                const roleAccessNames =  roleWithAccess!.accesss.map(roleAccess => {
                    return roleAccess.name;
                });
                for (let j = 0; j < roleAccessNames.length; j++) {
                    const element = roleAccessNames[j];
                    staffAccessNames.push(element);
                }
            }
            const checkAccess = staffAccessNames.indexOf(allowAccess) !== -1;
            if (checkAccess) {
                return next();
            } else {
                return next(new HttpException(403, '4 --- this staff has\'nt role to watch staff list !!!'));
            }
        } catch (error) {

        }
    }
}
export default rolesAccessMiddleware;