import { Request, Response, NextFunction } from 'express'
import HttpException from '../../exceptions/http.exception';
import Role from '../../models/Role';
import { validateRoleSave } from '../../utils/validator/admin/role';
// roles 保存
export const roleSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, desc } = req.body;
        // 接口数据验证
        let { error, validate } = validateRoleSave(name, desc);
        if (!validate) {
            throw new HttpException(422, "Role 验证错误", error);
        }
        // 业务验证 : 角色名称唯一
        const rolesTest = await Role.findOne({ name });
        if (rolesTest) {
            throw new HttpException(422, "this role_name has been exist");
        }

        const roleNew = new Role({ name, desc });
        let RoleSaveResult = await roleNew.save();
        res.json({
            flag: true,
            data: {
                msg: '保存角色成功',
                access: RoleSaveResult
            }
        })
    } catch (error) {
        next(error);
    }
}
// roles 列表
export const roleList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let RoleListResult = await Role.find({});
        res.json({
            status: true,
            data: RoleListResult
        })
    } catch (error) {
        next(error);
    }
}
// roles 详情
export const roleOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let RoleFindByIdResult = await Role.findById(id).populate('accesss');
        if (!RoleFindByIdResult) {
            throw new HttpException(422, "Role can't find");
        }
        res.json({
            flag: true,
            data: {
                msg: '角色详情获取成功',
                access: RoleFindByIdResult
            }
        })
    } catch (error) {
        next(error);
    }
}
// roles 修改
export const roleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.params;
        let { name, desc } = req.body;
        // 接口数据验证
        let { error, validate } = validateRoleSave(name, desc);
        if (!validate) {
            throw new HttpException(422, "Role参数验证错误", error);
        }
        // 业务验证
        const roleTest = await Role.findById( id );
        if (!roleTest) {
            throw new HttpException(422, "role is not exits");
        }
        // findByIdAndUpdate默认返回的是修改前的对象 第三个参数是配置项，可以设置返回修改后的
        const roleNew = await Role.findByIdAndUpdate(id, { name, desc }, { new: true });
        res.json({
            flag: true,
            data: {
                msg: '更新角色成功',
                access: roleNew
            }
        })
    } catch (error) {
        next(error);
    }
}
// role 授权
export const roleAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 角色 id
        let { _id, accesss } = req.body;
        // 权限 id 数组(被授权的)
        let id = _id;
        let access_ids = accesss;
        // 业务验证: 角色是否存在
        const roleTest = await Role.findById( id );
        if (!roleTest) {
            throw new HttpException(422, "role is not exits");
        }
        roleTest.accesss = access_ids;
        const roleSave = await roleTest.save();
        res.json({
            status: true,
            data: roleSave.accesss
        })
    } catch (error) {
        next(error);
    }
}