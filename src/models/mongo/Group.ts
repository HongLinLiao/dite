import { Schema, model } from 'mongoose';

import IGroup from '../data/Group';
import { addIdField } from '../../utils/mongo';

export const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    description: { type: String },
    createTime: { type: Number, required: true },
});

addIdField(GroupSchema);

const GroupModel = model<IGroup>('Group', GroupSchema);

export default GroupModel;
