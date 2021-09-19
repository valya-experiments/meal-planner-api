import express, { Application, Request, Response } from "express";
import { DatabaseAPI } from "./services/database";
import { makeMealsRouter } from "./resources/meals";

const app = express();

export function makeApp(db: DatabaseAPI): Application {
  app.use(express.json());

  app.use("/meals", makeMealsRouter(db));

  app.get("*", (_req: Request, res: Response) => {
    res.sendStatus(404);
  });

  return app;
}
