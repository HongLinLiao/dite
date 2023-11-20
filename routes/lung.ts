import { Router, Request, Response } from "express";
import { createLung, queryLungByUid } from "../services/lung";

const LungRouter = Router();

LungRouter.post("/", async (req: Request, res: Response) => {
  const { uid, year, month, day } = req.body;
  const data = await createLung({
    uid,
    year,
    month,
    day,
    standardQuantity: req.body.standardQuantity ?? null,
    packingQuantity: req.body.packingQuantity ?? null,
    createTime: new Date().getTime(),
  });
  res.json(data);
});

LungRouter.get("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;
  const data = await queryLungByUid(uid);
  res.json(data);
});

export default LungRouter;
