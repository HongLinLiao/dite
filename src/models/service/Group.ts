import IGroup from '../data/Group';
import IRole from '../data/Role';
import Member from './Member';

export default class Group {
    id?: string;
    name: string;
    description: string | null;
    createTime: number;
    member?: Member[];

    static toServiceModel(group: IGroup): Group {
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            createTime: group.createTime,
        };
    }
}
