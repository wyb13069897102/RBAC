import { model, Schema, Model, Document } from 'mongoose'
export interface IAccessDocument extends Document{
    name:string,
    desc:string
}
const accessSchema:Schema = new Schema({
    name: String,
    desc: String,
},{
    timestamps:true
})

const Staff:Model<IAccessDocument> = model<IAccessDocument>("Access", accessSchema, 'accesss');
export default Staff;