import request from "supertest";
import { makeApp } from "../../app";
import { DatabaseAPI } from "../../services/database";

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

const mockMeals = ["Chicken pita", "Tomato fish stew"];

beforeEach(() => {
  getMeals.mockReset();
  getMeals.mockResolvedValue({ error: null, data: [...mockMeals] });
});

test("returns 200", async () => {
  const response = await request(app).get("/meals");

  expect(response.status).toBe(200);
});

test("returns JSON header", async () => {
  const response = await request(app).get("/meals");

  expect(response.headers["content-type"]).toEqual(
    expect.stringContaining("json")
  );
});

test("calls getMeals DB method", async () => {
  await request(app).get("/meals");

  expect(getMeals).toHaveBeenCalledTimes(1);
});

test("returns meals array", async () => {
  const response = await request(app).get("/meals");

  expect(response.body.meals).toBeDefined();
  expect(response.body.meals).toBeInstanceOf(Array);
});

test("returns meals array from DB", async () => {
  const response = await request(app).get("/meals");

  expect(response.body.meals).toEqual([...mockMeals]);
});

describe("on database error", () => {
  beforeEach(() => {
    getMeals.mockResolvedValue({
      error: {
        type: "remote db",
        message: "not implemented",
      },
      data: null,
    });
  });

  test("returns 500", async () => {
    const response = await request(app).get("/meals");

    expect(response.status).toBe(500);
  });

  test("returns error object", async () => {
    const response = await request(app).get("/meals");

    expect(response.body).toEqual({
      error: { type: "remote db", message: "not implemented" },
    });
  });
});
