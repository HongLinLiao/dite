import { ClientSession } from 'mongoose';

import GroupModel from '../models/mongo/Group';
import Group from '../models/service/Group';
import { createSession } from '../utils/mongo';
import RoleModel from '../models/mongo/Role';
import { Role } from '../enums/Role';
import Member from '../models/service/Member';

export async function createGroup(group: Group, owner: string): Promise<Group | null> {
    const { startSession, addTransaction, concatTransaction } = await createSession();

    // TODO: Transaction deliver data
    let groupId: string = '';

    const createGroup = async (session: ClientSession) => {
        return await new GroupModel({
            name: group.name,
            description: group.description,
            createTime: group.createTime,
        })
            .save({ session })
            .then((x) => {
                groupId = x.id;
                return Group.toServiceModel(x);
            });
    };

    const createOwner = (group: Group) => async (session: ClientSession) => {
        return await new RoleModel({
            gid: group.id,
            uid: owner,
            role: Role.Owner,
            createTime: group.createTime,
        }).save({ session });
    };

    const transaction = concatTransaction(createGroup, createOwner);
    addTransaction(transaction);

    await startSession();

    let createData: Group | null = null;
    if (groupId) {
        createData = await queryGroupById(groupId);
    }

    return createData;
}

export async function queryGroupById(gid: string, options: { withMember: boolean } = { withMember: true }): Promise<Group | null> {
    const groupSearch = await GroupModel.findById(gid).exec();
    const group = groupSearch && Group.toServiceModel(groupSearch);

    if (group && options.withMember) {
        const members = await queryMemberByGid([gid]);
        if (members) {
            Group.setMember(group, members);
        }
    }

    return group;
}

export async function searchGroup(keyword: string, options: { withMember: boolean } = { withMember: true }): Promise<Group[]> {
    // TODO: Change to mongo util function
    const groupSearch = await GroupModel.find({
        $or: [{ name: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }],
    }).exec();
    const groups = groupSearch.map((x) => Group.toServiceModel(x));

    if (groups.length && options.withMember) {
        const groupIds = groups.map((x) => x.id) as string[];
        const memberList = await queryMemberByGid(groupIds);
        for (const group of groups) {
            const members = memberList.filter((x) => x.gid === group.id);
            if (members.length) {
                group.member = members;
            }
        }
    }

    return groups;
}

export async function queryMemberByGid(gidList: string[]): Promise<Member[]> {
    let members: Member[] = [];

    if (gidList.length) {
        // TODO: Change to mongo util function
        const memberSearch = await RoleModel.find({ gid: { $in: gidList } }).exec();
        members = memberSearch.map((x) => Member.toServiceModel(x));
    }

    return members;
}

export async function deleteGroup(gid: string): Promise<void> {
    const { startSession, addTransaction } = await createSession();

    const groupTransaction = async (session: ClientSession) => await GroupModel.findByIdAndDelete(gid, { session }).exec();
    const memberTransaction = async (session: ClientSession) => await RoleModel.deleteMany({ gid }, { session }).exec();

    addTransaction(groupTransaction);
    addTransaction(memberTransaction);

    await startSession();
}
