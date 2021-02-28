import { Request, Response, NextFunction } from 'express'
import HttpException from '../../exceptions/http.exception';
import Access from '../../models/Access';
import { validateAccessSave } from '../../utils/validator/admin/access';
// access 保存
export const accessSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, desc } = req.body;
        // 接口数据验证
        let { error, validate } = validateAccessSave(name, desc);
        if (!validate) {
            throw new HttpException(422, "AccessSave错误", error);
        }
        // 业务验证
        const accessTest = await Access.findOne({ name });
        if (accessTest) {
            throw new HttpException(422, "this access_name has been exist");
        }

        const accessNew = new Access({ name, desc });
        let AccessSaveResult = await accessNew.save();
        res.json({
            flag: true,
            data: {
                msg: '保存权限成功',
                access: AccessSaveResult
            }
        })
    } catch (error) {
        next(error);
    }
}
// access 列表
export const accessList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let AccessListResult = await Access.find({});
        res.json({
            status: true,
            data: AccessListResult
        })
    } catch (error) {
        next(error);
    }
}
// access 详情
export const accessOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let AccessFindByIdResult = await Access.findById(id);
        if (!AccessFindByIdResult) {
            throw new HttpException(422, "Access can't find");
        }
        res.json({
            flag: true,
            data: {
                msg: '权限详获取情成功',
                access: AccessFindByIdResult
            }
        })
    } catch (error) {
        next(error);
    }
}
// access 修改
export const accessUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.params;
        let { name, desc } = req.body;
        // 接口数据验证
        let { error, validate } = validateAccessSave(name, desc);
        if (!validate) {
            throw new HttpException(422, "Access参数验证错误", error);
        }
        // 业务验证
        const accessTest = await Access.findById( id );
        if (!accessTest) {
            throw new HttpException(422, "access is not exits");
        }
        // findByIdAndUpdate默认返回的是修改前的对象 第三个参数是配置项，可以设置返回修改后的
        const accessNew = await Access.findByIdAndUpdate(id, { name, desc }, { new: true });
        res.json({
            flag: true,
            data: {
                msg: '更新权限成功',
                access: accessNew
            }
        })
    } catch (error) {
        next(error);
    }
}
// access 删除
export const accessDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.params;
        // 业务验证
        const accessTest = await Access.findById( id );
        if (!accessTest) {
            throw new HttpException(422, "this access is not exits");
        }
        // findByIdAndDelete 返回被删除的那一项
        const accessDel = await Access.findByIdAndDelete(id);
        res.json({
            flag: true,
            data: {
                msg: '删除权限成功',
                access: accessDel
            }
        })
    } catch (error) {
        next(error);
    }
}