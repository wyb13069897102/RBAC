import { model, Schema, Model, Document } from 'mongoose'
import { IAccessDocument } from './Access';
export interface IRoleDocument extends Document{
    name:string,
    desc:string,
    accesss:IAccessDocument['_id'][]
}
const roleSchema:Schema = new Schema({
    name: {
        type:String,
        required:[true,'角色名称不能为空'],
        trim:true
    }, // 角色名称
    desc: String, // 角色描述
    accesss:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Access'
        }
    ]
},{
    timestamps:true
})

const Role:Model<IRoleDocument> = model<IRoleDocument>("Role", roleSchema, 'roles');
export default Role;