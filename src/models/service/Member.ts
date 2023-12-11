import { Role as RoleType } from '../../enums/Role';
import IRole from '../data/Role';

export default class Member {
    id: string;
    gid: string;
    uid: string;
    role: RoleType;
    createTime: number;

    static toServiceModel(data: IRole): Member {
        return {
            id: data.id,
            gid: data.gid,
            uid: data.uid,
            role: data.role,
            createTime: data.createTime,
        };
    }
}
