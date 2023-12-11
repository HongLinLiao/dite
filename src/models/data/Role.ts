import { Role } from '../../enums/Role';

export default interface IRole {
    id: string;
    gid: string;
    uid: string;
    role: Role;
    createTime: number;
}
