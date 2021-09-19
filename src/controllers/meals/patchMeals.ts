import { Request, Response } from "express";
import { DatabaseAPI } from "../../services/database";

export const patchMeals = (db: DatabaseAPI) => async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, type, date } = req.body;

  if (!name || !type || !date) {
    res.status(422).send({
      error: {
        message: "missing props",
        data: null,
      },
    });
    return;
  }

  const { mealId } = req.params;
  const { error, data } = await db.updateMeal({ ...req.body, id: mealId });

  if (error) {
    res.status(500).send({ error: { ...error } });
    return;
  }

  res.send({ ...data });
};
