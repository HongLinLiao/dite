import { ClientSession } from 'mongoose';

import GroupModel from '../models/mongo/Group';
import Group from '../models/service/Group';
import { createSession } from '../utils/mongo';
import RoleModel from '../models/mongo/Role';
import { Role } from '../enums/Role';
import Member from '../models/service/Member';
import { createNotification, queryNotification } from './notification';
import { NotificationType } from '../enums/NotificationType';
import { NotificationLevel } from '../enums/NotificationLevel';
import { ConfirmStatus } from '../enums/ConfirmStatus';
import { queryUserById } from './user';
import Notification from '../models/service/Notification';
import NotificationModel from '../models/mongo/Notification';
import {
    CreateGroupError,
    GroupNotFoundError,
    GroupPermissionError,
    InviteGroupError,
    NotificationNotFoundError,
    NotificationPermissionError,
    UpdateNotificationError,
    UserNotFoundError,
} from '../models/service-error';

export async function createGroup(group: Group, owner: string): Promise<Group> {
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

    if (groupId) {
        const queryGroup = await queryGroupById(groupId, { withMember: true });
        if (queryGroup) {
            return queryGroup;
        }
    }

    throw new CreateGroupError(`Can not find created group with gid ${groupId}`);
}

export async function queryGroupById(gid: string, options?: { withMember?: boolean }): Promise<Group | null> {
    const groupSearch = await GroupModel.findById(gid).exec();
    const group = groupSearch && Group.toServiceModel(groupSearch);

    if (group && options && options.withMember) {
        group.member = await queryMemberByGid([gid]);
    }

    return group;
}

export async function queryGroupByUid(uid: string, options?: { withMember?: boolean }): Promise<Group[]> {
    let userGroup: Group[] = [];

    const groupIds = (await RoleModel.find({ uid }).exec()).map((x) => x.gid);
    if (groupIds.length) {
        const searchGroup = await GroupModel.find({ _id: { $in: groupIds } }).exec();
        userGroup = searchGroup.map((x) => Group.toServiceModel(x));
    }

    if (userGroup.length && options && options.withMember) {
        const memberList = await queryMemberByGid(groupIds);
        for (const group of userGroup) {
            group.member = memberList.filter((x) => x.gid === group.id);
        }
    }

    return userGroup;
}

export async function searchGroup(keyword: string, options?: { withMember?: boolean }): Promise<Group[]> {
    // TODO: Change to mongo util function
    const groupSearch = await GroupModel.find({
        $or: [{ name: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }],
    }).exec();
    const groups = groupSearch.map((x) => Group.toServiceModel(x));

    if (groups.length && options && options.withMember) {
        const groupIds = groups.map((x) => x.id) as string[];
        const memberList = await queryMemberByGid(groupIds);
        for (const group of groups) {
            group.member = memberList.filter((x) => x.gid === group.id);
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
        throw new GroupPermissionError('User has not permission to delete group');
    }

    const { startSession, addTransaction } = await createSession();

    const groupTransaction = async (session: ClientSession) => await GroupModel.findByIdAndDelete(gid, { session }).exec();
    const memberTransaction = async (session: ClientSession) => await RoleModel.deleteMany({ gid }, { session }).exec();

    addTransaction(groupTransaction);
    addTransaction(memberTransaction);

    await startSession();
}

export async function inviteGroup(from: string, to: string, gid: string, level: Role): Promise<Notification> {
    const fromUser = await queryUserById(from);
    if (!fromUser) {
        throw new UserNotFoundError(`User ${from} not found`);
    }

    const toUser = await queryUserById(from);
    if (!toUser) {
        throw new UserNotFoundError(`User ${from} not found`);
    }

    const group = await queryGroupById(gid, { withMember: true });
    if (!group) {
        throw new GroupNotFoundError('Group not found');
    }

    if (
        !group.member ||
        !group.member.length ||
        !group.member.filter((member) => member.uid === from && (member.role === Role.Owner || member.role === Role.Manager)).length
    ) {
        throw new GroupPermissionError('User has no permission to invite others into group');
    }

    if (group.member.filter((member) => member.uid === to).length) {
        throw new InviteGroupError('User already in group');
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

export async function confirmGroupInvitation(notificationId: string, uid: string, confirmStatus?: ConfirmStatus): Promise<Notification> {
    const notification = await queryNotification(notificationId);

    if (!notification) {
        throw new NotificationNotFoundError('Notification not found');
    }

    if (notification.to !== uid) {
        throw new NotificationPermissionError(`User has no permission to operate the notification`);
    }

    if (confirmStatus === ConfirmStatus.None || confirmStatus === ConfirmStatus.Pending) {
        throw new UpdateNotificationError(`Invalid confirm status`);
    }

    if (notification.status !== ConfirmStatus.Pending) {
        throw new UpdateNotificationError(`Notification was confirmed before`);
    }

    const notificationParams = { ...notification, touched: true };
    if (confirmStatus) {
        notificationParams.status = confirmStatus;
    }

    const { addTransaction, startSession } = await createSession();

    if (confirmStatus === ConfirmStatus.Confirm) {
        const searchRole = await RoleModel.findOne({ uid, gid: notification.target }).exec();
        if (!searchRole) {
            const createRole = async (session: ClientSession) => {
                return await new RoleModel({
                    gid: notification.target,
                    uid: notification.to,
                    role: Role.Member,
                    createTime: new Date().getTime(),
                }).save({ session });
            };
            addTransaction(createRole);
        }
    }

    const updateNotification = async (session: ClientSession) =>
        await NotificationModel.findByIdAndUpdate(notificationId, notificationParams, { session }).exec();

    addTransaction(updateNotification);

    await startSession();

    const searchNotification = await queryNotification(notificationId);
    if (!searchNotification) {
        throw new NotificationNotFoundError('Notification not found');
    }

    return searchNotification;
}
