import { Request, Response } from "express";
import { DatabaseAPI } from "../../services/database";

export const postMeals = (db: DatabaseAPI) => async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, type, date } = req.body;

  if (!name || !type || !date) {
    const missingPropertiesList: string[] = Object.entries({
      name,
      type,
      date,
    })
      .filter((entry) => {
        const [, value] = entry;
        return typeof value === "undefined";
      })
      .map((entry) => {
        const [key] = entry;
        return key;
      });

    res.status(422).send({
      error: {
        message: "missing props",
        data: missingPropertiesList,
      },
    });
    return;
  }

  const { error, data } = await db.createMeal({ ...req.body });

  if (error) {
    res.status(500).send({ error: { ...error } });
    return;
  }

  res.send({ ...data });
};
