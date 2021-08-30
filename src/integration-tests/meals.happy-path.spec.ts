import { Application } from "express";
import { Pool } from "pg";
import request from "supertest";
import { makeApp } from "../app";
import { makeDatabase, Meal, MealType } from "../database";
import { getEnvVar } from "../utils/getEnvVar";

const mockPayload: Omit<Meal, "id"> = {
  name: "Fajitas",
  type: MealType.Lunch,
  date: "2021-07-19",
};

const connectionString = getEnvVar("DB_CONNECTION_STRING");

const dbClient = new Pool({ connectionString });

const app: Application = makeApp(makeDatabase(dbClient));
let mealId: string;

afterAll(() => {
  dbClient.end();
});

describe("preflight checks", () => {
  test("meals table is initially empty", async () => {
    const response = await request(app).get("/meals");

    expect(response.body.meals).toEqual([]);
  });
});

describe("meals operations", () => {
  test("create new meal", async () => {
    const response = await request(app)
      .post("/meals")
      .send({ ...mockPayload });

    expect(response.body).toHaveProperty("id");
    mealId = response.body.id;

    expect(response.statusCode).toEqual(200);
  });

  test("find new meal in the table", async () => {
    const response = await request(app).get("/meals");

    expect(response.body.meals[0].id).toBe(mealId);
  });

  test("change meal name", async () => {
    const response = await request(app)
      .patch(`/meals/${mealId}`)
      .send({
        ...mockPayload,
        name: "Falafel",
      });

    expect(response.statusCode).toEqual(200);
  });

  test("check that the meal has new name", async () => {
    const response = await request(app).get("/meals");

    expect(response.body.meals[0].name).toBe("Falafel");
  });

  test("delete this meal", async () => {
    const response = await request(app).delete(`/meals/${mealId}`);

    expect(response.statusCode).toEqual(200);
  });

  test("meals table is now empty", async () => {
    const response = await request(app).get("/meals");

    expect(response.body.meals).toEqual([]);
  });
});
