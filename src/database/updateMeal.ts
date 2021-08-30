import { Pool } from "pg";
import { DatabaseResponse, Meal } from ".";

export function updateMeal(
  dbClient: Pool
): (meal: Meal) => Promise<DatabaseResponse<Meal>> {
  return async (meal) => {
    const { id, name, date, type } = meal;

    try {
      const result = await dbClient.query(
        `UPDATE public."Meals" SET name=$1, date=$2, type=$3 WHERE id=$4;`,
        [name, date, type, id]
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
