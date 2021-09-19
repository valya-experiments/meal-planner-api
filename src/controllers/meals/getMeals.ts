import { Request, Response } from "express";
import { DatabaseAPI } from "../../services/database";

export const getMeals = (db: DatabaseAPI) => async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const { error, data } = await db.getMeals();

  if (error) {
    res.status(500).send({ error: { ...error } });
    return;
  }
  res.send({ meals: data });
};
