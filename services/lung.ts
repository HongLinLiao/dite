import LungModel from "../models/mongo/Lung";
import Lung from "../models/service/Lung";
import { queryUserById } from "./user";

export async function createLung(lung: Lung) {
  const user = await queryUserById(lung.uid);

  if (!user) {
    throw new Error("User not exist!");
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
  const user = await queryUserById(uid);

  if (!user) {
    throw new Error("User not exist!");
  }

  const lungs = await LungModel.find({ uid }).exec();

  return lungs.map((lung) => Lung.toServiceModel(lung));
}
