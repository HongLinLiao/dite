import LungModel from '../models/mongo/Lung';
import { UserNotFoundError } from '../models/service-error';
import Lung from '../models/service/Lung';
import { queryUserById } from './user';

export async function createLung(lung: Lung) {
    const user = await queryUserById(lung.uid);

    if (!user) {
        throw new UserNotFoundError('User not found');
    }

    const newLung = await new LungModel({
        uid: lung.uid,
        year: lung.year,
        month: lung.month,
        day: lung.day,
        standardQuantity: lung.standardQuantity,
        packingQuantity: lung.packingQuantity,
        createTime: lung.createTime,
    }).save();

    return Lung.toServiceModel(newLung);
}

export async function queryLungByUid(uid: string) {
    const lungs = await LungModel.find({ uid }).exec();
    return lungs.map((lung) => Lung.toServiceModel(lung));
}
