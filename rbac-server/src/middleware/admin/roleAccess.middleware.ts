import { time } from 'console';
import { Request, Response, NextFunction } from 'express'
import HttpException from '../../exceptions/http.exception';
import Access from '../../models/Access';
import Role from '../../models/Role';
import Staff from '../../models/Staff';

const roleAccessMiddleware = (allowAccess: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let staff = req.staff!;
            // 超级管理员 登录需要验证, 权限不需要验证 直接放行
            if (staff.isSuper) next();
            // console.log('staff : ',staff);

            // 单角色
            // 当前用户的角色
            // const staffRole = await Role.findById(staff.role).populate('accesss');
            // // console.log('staffRole : ',staffRole);
            // if (!staffRole) {
            //     return next(new HttpException(403, 'this staff has\'nt role or role has been limited!!!'));
            // }
            // // 获取当前用户的所有权限 ( staff - role - accesss ) 
            // const staffAccess = staffRole.accesss.map(item=>{
            //     return item.name;
            // });
            // // console.log(staffAccess); ["role list","role update","role one","role save"]
            // const checksAccess = staffAccess.indexOf(allowAccess) !== -1;
            // if(checksAccess){
            //     return next();
            // }else{
            //     return next(new HttpException(403, 'this staff has\'nt role to watch staff list !!!'));
            // }

            // // 多角色
            // // 当前用户的所有角色
            const staffRole = await Staff.findById(staff._id).populate('roles');
            if (!staffRole) {
                return next(new HttpException(403, '1 --- this staff has\'nt role or role has been limited!!!'));
            }
            const staffRoles = staffRole.roles;
            // console.log('staffRoles : ',staffRoles);
            // 获取当前用户的所有权限 ( staff - role - accesss ) 
            const staffAccessIDs: string[] = [];
            staffRoles.map(item => {
                item.accesss.map((a_item: string) => {
                    staffAccessIDs.push(a_item);
                });
            });
            for (let i = 0; i < staffAccessIDs.length; i++) {
                const access = await Access.findById(staffAccessIDs[i]);
                if (!access) {
                    return next(new HttpException(403, 'access doesn\'t exist!!!'));
                }
                const checksAccess = allowAccess.indexOf(access.name) !== -1;
                if(checksAccess){
                    return next();
                }
            }
            return next(new HttpException(403, '2 --- this staff has\'nt role to watch staff list !!!'));
        } catch (error) {

        }
    }
}
export default roleAccessMiddleware;