import { Schema, model } from 'mongoose';

import IRole from '../data/Role';
import { addIdField } from '../../utils/mongo';
import { Role } from '../../enums/Role';

export const RoleSchema = new Schema<IRole>({
    gid: { type: String, ref: 'Group', required: true },
    uid: { type: String, ref: 'User', required: true },
    role: {
        type: Number,
        enum: Role,
        default: Role.Member,
        required: true,
    },
    createTime: { type: Number, required: true },
});

addIdField(RoleSchema);

const RoleModel = model<IRole>('Role', RoleSchema);

export default RoleModel;
