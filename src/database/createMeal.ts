import { Pool } from "pg";
import { DatabaseResponse, Meal } from ".";

export function createMeal(
  dbClient: Pool
): (meal: Omit<Meal, "id">) => Promise<DatabaseResponse<Meal>> {
  return async (meal: Omit<Meal, "id">): Promise<DatabaseResponse<Meal>> => {
    try {
      const { name, type, date } = meal;

      const result = await dbClient.query(
        `INSERT INTO public."Meals"( "name", "date", "type") VALUES ( $1, $2, $3) RETURNING "id";`,
        [name, date, type]
      );

      return {
        error: null,
        data: { ...result.rows[0], ...meal },
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
