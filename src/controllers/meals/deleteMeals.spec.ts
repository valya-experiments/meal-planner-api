import request from "supertest";
import { makeApp } from "../../app";
import { DatabaseAPI, Meal, MealType } from "../../services/database";

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

const mockPayload: Omit<Meal, "id"> = {
  name: "Fajitas",
  type: MealType.Lunch,
  date: "19-07-2021",
};

beforeEach(() => {
  deleteMeal.mockReset();
  deleteMeal.mockResolvedValue({
    error: null,
    data: {
      id: "111",
      ...mockPayload,
    },
  });
});

test("returns 200", async () => {
  const response = await request(app).delete("/meals/111");

  expect(response.status).toBe(200);
});

test("returns JSON header", async () => {
  const response = await request(app).delete("/meals/111");

  expect(response.headers["content-type"]).toEqual(
    expect.stringContaining("json")
  );
});

test("calls deleteMeal with provided id", async () => {
  await request(app).delete("/meals/111");

  expect(deleteMeal).toHaveBeenCalledWith("111");
});

test("returns meal provided by database", async () => {
  const response = await request(app).delete("/meals/111");

  expect(response.body).toEqual({ ...mockPayload, id: "111" });
});

describe("on database error", () => {
  beforeEach(() => {
    deleteMeal.mockResolvedValue({
      error: {
        type: "remote db",
        message: "not implemented",
      },
      data: null,
    });
  });

  test("returns 500", async () => {
    const response = await request(app).delete("/meals/111");

    expect(response.status).toBe(500);
  });

  test("returns error object", async () => {
    const response = await request(app).delete("/meals/111");

    expect(response.body).toEqual({
      error: { type: "remote db", message: "not implemented" },
    });
  });
});
