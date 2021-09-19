import { Pool } from "pg";
import { DatabaseResponse, Meal } from ".";

export function getMeals(
  dbClient: Pool
): () => Promise<DatabaseResponse<Meal[]>> {
  return async (): Promise<DatabaseResponse<Meal[]>> => {
    try {
      const result = await dbClient.query('SELECT * FROM public."Meals"');

      return {
        error: null,
        data: result.rows,
      };
    } catch (error) {
      return {
        error: {
          type: "database query failed",
          details: error,
        },
        data: null,
      };
    }
  };
}
