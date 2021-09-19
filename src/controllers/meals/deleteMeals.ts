import { Request, Response } from "express";
import { DatabaseAPI } from "../../services/database";

export const deleteMeals = (db: DatabaseAPI) => async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { mealId } = req.params;
  const { error, data } = await db.deleteMeal(mealId);

  if (error) {
    res.status(500).send({ error: { ...error } });
    return;
  }

  res.send({ ...data });
};
