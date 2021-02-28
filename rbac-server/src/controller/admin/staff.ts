import { Request, Response, NextFunction } from 'express'
import md5 from 'md5';
import HttpException from '../../exceptions/http.exception';
import Staff, { IStaffDocument } from '../../models/Staff';
import { validateStaffLogin } from '../../utils/validator/admin/staff';
import jwt from 'jsonwebtoken'
import config from '../../config'
import Role, { IRoleDocument } from '../../models/Role';
import { JWT_Payload_Admin } from '../../types/jwt';

const generatorToken = (payload:JWT_Payload_Admin) => {
    // let payload = { id };
    let privateKey = config.auth.adminPrivateKey;
    let options = { expiresIn: '10h' };
    const token = jwt.sign(payload, privateKey, options);
    return token;
}
// 登录
export const staffLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { username, password } = req.body;
        // 接口数据验证
        let { error, validate } = validateStaffLogin(username, password);
        if (!validate) {
            throw new HttpException(422, 'Staff 验证错误', error);
        }
        // 业务验证 :  
        // 1. 验证员工是否存在
        const staff = await Staff.findOne({ username }).populate('roles');
        if (!staff) {
            throw new HttpException(422, 'staff not found...');
        }
        // 2. 验证密码
        const match = md5(password) === staff.password;
        if (!match) {
            throw new HttpException(422, 'password not match...');
        }
        // 3. 生成 token
        // console.log(staff);
        // const currentRole = staff.role.name
        const payload = { id:staff._id, username:staff.username, currentRole:'admin'};
        const token = generatorToken(payload);
        // 4. 返回结果
        res.json({
            status: true,
            data: {
                username: staff.username,
                currentAuthority: 'admin',
                token: token
            }
        })
    } catch (error) {
        next(error);
    }
}
// 列表
export const staffList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffs = await Staff.find({}).populate("roles");
        // 4. 返回结果
        res.json({
            status: true,
            data: staffs
        })
    } catch (error) {
        next(error);
    }
}
// 添加
export const staffSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { username, password } = req.body;
        // 接口数据验证
        let { error, validate } = validateStaffLogin(username, password);
        if (!validate) {
            throw new HttpException(422, 'Staff 验证错误', error);
        }
        // 业务验证 :  
        // 1. 验证员工是否存在
        const staff = await Staff.findOne({ username });
        if (staff) {
            throw new HttpException(422, 'staff has been exist');
        }
        const staffNew = new Staff({
            username, password: md5(password)
        })
        const staffSave = await staffNew.save();
        // 4. 返回结果
        res.json({
            status: true,
            data: { 
                msg: '用户创建成功',
                staff: staffSave
            }
        })
    } catch (error) {
        next(error);
    }
}
// 修改
export const staffUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.params;
        let { username, password } = req.body;
        // 接口数据验证
        let { error, validate } = validateStaffLogin(username, password);
        if (!validate) {
            throw new HttpException(422, 'Staff 验证错误', error);
        }
        // 业务验证 :  
        // 1. 验证员工是否存在
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new HttpException(422, 'staff does not exist');
        }
        const staffUpdate = await Staff.findByIdAndUpdate(id, { username, password: md5(password) }, { new: true })
        // 3. 返回结果
        res.json({
            status: true,
            data:staffUpdate
        })
    } catch (error) {
        next(error);
    }
}
// 详情
export const staffOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        res.json({
            isOk: true,
            data: {
                msg: '查询staff详情成功',
                staff
            }
        })
    } catch (error) {
        next(error);
    }
}
// 授予角色
export const staffRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id, roleID } = req.params;
        // 业务验证 :  
        // 1. 验证员工是否存在
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new HttpException(422, 'staff does not exist');
        }
        // 2. 验证角色是否存在
        const role = await Role.findById(roleID);
        if (!role) {
            throw new HttpException(422, 'role does not exist');
        }
        // 3. 授予 staff角色
        staff.role = roleID; 
        const staffRole = await staff.save();
        // 4. 返回结果
        res.json({
            isOk: true,
            data: {
                msg: '授予用户角色成功',
                staff: staffRole
            }
        })
    } catch (error) {
        next(error);
    }
}
// 授予多角色
export const staffRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { id } = req.params;
        let { roles } = req.body;
        // 业务验证 :  
        // 1. 验证员工是否存在
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new HttpException(422, 'staff does not exist');
        }
        // 2. 授予 staff角色
        staff.roles = roles; 
        const staffRole = await staff.save();
        // 3. 返回结果
        res.json({
            status: true,
            data: {
                msg: '授予用户多角色成功',
                staff: staffRole
            }
        })
    } catch (error) {
        next(error);
    }
}
// staff 当前用户
export const currentStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staff = req.staff as IStaffDocument;
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
        res.json({
            status: true,
            data: {
                userid:staff._id,
                name: staff.username,
                avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=24336452,906724543&fm=26&gp=0.jpg',
                isSuper: staff.isSuper,
                accesss: staffAccessNames
            }
        })
    } catch (error) {
        next(error);
    }
}