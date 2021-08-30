import { Pool } from "pg";
import { createMeal } from "./createMeal";
import { deleteMeal } from "./deleteMeal";
import { getMeals } from "./getMeals";
import { updateMeal } from "./updateMeal";

export enum MealType {
  // these integer strings match primary keys from the MealTypes table
  Breakfast = "10",
  Lunch = "20",
  Dinner = "30",
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  date: string;
}

export interface DatabaseError {
  type: string;
  details: string;
}

export interface DatabaseResponse<DataType> {
  data: DataType | null;
  error: DatabaseError | null;
}

export interface DatabaseAPI {
  getMeals: () => Promise<DatabaseResponse<Meal[]>>;
  createMeal: (meal: Omit<Meal, "id">) => Promise<DatabaseResponse<Meal>>;
  updateMeal: (meal: Meal) => Promise<DatabaseResponse<Meal>>;
  deleteMeal: (id: string) => Promise<DatabaseResponse<Meal>>;
}

export function makeDatabase(dbClient: Pool): DatabaseAPI {
  const database: DatabaseAPI = {
    getMeals: getMeals(dbClient),
    createMeal: createMeal(dbClient),
    updateMeal: updateMeal(dbClient),
    deleteMeal: deleteMeal(dbClient),
  };

  return database;
}
