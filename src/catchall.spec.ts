import request from "supertest";
import { makeApp } from "./app";
import { DatabaseAPI } from "./services/database";

const getMeals = jest.fn();
const createMeal = jest.fn();
const updateMeal = jest.fn();
const deleteMeal = jest.fn();

export const mockDB: DatabaseAPI = {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
};

const app = makeApp(mockDB);

describe("catchall handler", () => {
  test("returs 404", async () => {
    const response = await request(app).get("/gibberish");

    expect(response.status).toBe(404);
  });
});
