
import { IStaffDocument } from "../models/Staff";

export interface JWT_Payload_Admin {
    id: IStaffDocument['_id'],
    username: string,
    currentRole: string
}