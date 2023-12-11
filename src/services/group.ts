import { ClientSession } from 'mongoose';

import GroupModel from '../models/mongo/Group';
import Group from '../models/service/Group';
import { createSession } from '../utils/mongo';
import RoleModel from '../models/mongo/Role';
import { Role } from '../enums/Role';
import Member from '../models/service/Member';
import { createNotification } from './notification';
import { NotificationType } from '../enums/NotificationType';
import { NotificationLevel } from '../enums/NotificationLevel';
import { ConfirmStatus } from '../enums/ConfirmStatus';
import { queryUserById } from './user';
import { BadRequestError, ForbiddenError } from '../utils/response';

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

export async function deleteGroup(uid: string, gid: string): Promise<void> {
    const group = await queryGroupById(gid, { withMember: true });
    if (!group || !group.member || !group.member.filter((x) => x.uid === uid && x.role === Role.Owner).length) {
        throw new ForbiddenError();
    }

    const { startSession, addTransaction } = await createSession();

    const groupTransaction = async (session: ClientSession) => await GroupModel.findByIdAndDelete(gid, { session }).exec();
    const memberTransaction = async (session: ClientSession) => await RoleModel.deleteMany({ gid }, { session }).exec();

    addTransaction(groupTransaction);
    addTransaction(memberTransaction);

    await startSession();
}

export async function inviteGroup(from: string, to: string, gid: string, level: Role) {
    const group = await queryGroupById(gid, { withMember: true });
    if (!group) {
        throw new BadRequestError('Group not found');
    }

    if (
        !group.member ||
        !group.member.length ||
        !group.member.filter((member) => member.uid === from && (member.role === Role.Owner || member.role === Role.Manager)).length
    ) {
        throw new ForbiddenError();
    }

    const fromUser = await queryUserById(from);
    if (!fromUser) {
        throw new BadRequestError('User(from) not found');
    }

    const toUser = await queryUserById(to);
    if (!toUser) {
        throw new BadRequestError('User(to) not found');
    }

    if (group.member.filter((member) => member.uid === to).length) {
        throw new BadRequestError('User already in group');
    }

    // TODO: invite to owner or manager
    const notification = await createNotification({
        type: NotificationType.GroupInvite,
        from,
        fromLevel: NotificationLevel.User,
        to,
        status: ConfirmStatus.Pending,
        target: gid,
        touched: false,
        createTime: new Date().getTime(),
    });

    return notification;
}
