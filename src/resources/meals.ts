import express, { Router, Request, Response } from "express";
import { DatabaseAPI } from "../database";
const router = express.Router();

export function makeMealsRouter(db: DatabaseAPI): Router {
  // GET
  router.get("/", async (_req: Request, res: Response) => {
    const { error, data } = await db.getMeals();

    if (error) {
      res.status(500).send({ error: { ...error } });
      return;
    }
    res.send({ meals: data });
  });

  // POST
  router.post("/", async (req: Request, res: Response) => {
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
  });

  // PATCH
  router.patch("/:mealId", async (req: Request, res: Response) => {
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
  });

  // DELETE
  router.delete("/:mealId", async (req: Request, res: Response) => {
    const { mealId } = req.params;
    const { error, data } = await db.deleteMeal(mealId);

    if (error) {
      res.status(500).send({ error: { ...error } });
      return;
    }

    res.send({ ...data });
  });

  return router;
}
