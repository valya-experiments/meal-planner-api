import { Pool } from "pg";
import { DatabaseResponse, Meal } from ".";

export function deleteMeal(
  dbClient: Pool
): (mealId: string) => Promise<DatabaseResponse<Meal>> {
  return async (mealId) => {
    try {
      const result = await dbClient.query(
        `DELETE FROM public."Meals" WHERE "id"=$1;`,
        [mealId]
      );

      return {
        error: null,
        data: result.rows[0],
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
