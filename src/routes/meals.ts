import express, { Router } from "express";
import { deleteMeals } from "../controllers/meals/deleteMeals";
import { getMeals } from "../controllers/meals/getMeals";
import { patchMeals } from "../controllers/meals/patchMeals";
import { postMeals } from "../controllers/meals/postMeals";
import { DatabaseAPI } from "../services/database";

const router = express.Router();

export function makeMealsRouter(db: DatabaseAPI): Router {
  router.get("/", getMeals(db));

  router.post("/", postMeals(db));

  router.patch("/:mealId", patchMeals(db));

  router.delete("/:mealId", deleteMeals(db));

  return router;
}
