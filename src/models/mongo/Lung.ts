import { Schema, model } from "mongoose";

import ILung from "../data/Lung";
import { addIdField } from "../../utils/mongo";

export const LungSchema = new Schema<ILung>({
  uid: { type: String, ref: "User", required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  standardQuantity: { type: Number },
  packingQuantity: { type: Number },
  createTime: { type: Number, required: true },
});

addIdField(LungSchema);

const LungModel = model("Lung", LungSchema);

export default LungModel;
