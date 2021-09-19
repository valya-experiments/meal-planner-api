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
  createMeal.mockReset();
  createMeal.mockResolvedValue({
    error: null,
    data: {
      id: "111",
      ...mockPayload,
    },
  });
});

test("returns 200", async () => {
  const response = await request(app)
    .post("/meals")
    .send({ ...mockPayload });

  expect(response.status).toBe(200);
});

test("returns JSON header", async () => {
  const response = await request(app)
    .post("/meals")
    .send({ ...mockPayload });

  expect(response.headers["content-type"]).toEqual(
    expect.stringContaining("json")
  );
});

test("calls createMeal with provided data", async () => {
  await request(app)
    .post("/meals")
    .send({ ...mockPayload });

  expect(createMeal).toHaveBeenCalledWith({ ...mockPayload });
});

test("returns meal with an id provided by DB", async () => {
  const response = await request(app)
    .post("/meals")
    .send({ ...mockPayload });

  expect(response.body).toEqual({ id: "111", ...mockPayload });
});

describe("on database error", () => {
  beforeEach(() => {
    createMeal.mockResolvedValue({
      error: {
        type: "remote db",
        message: "not implemented",
      },
      data: null,
    });
  });

  test("returns 500", async () => {
    const response = await request(app)
      .post("/meals")
      .send({ ...mockPayload });

    expect(response.status).toBe(500);
  });

  test("returns error object", async () => {
    const response = await request(app)
      .post("/meals")
      .send({ ...mockPayload });

    expect(response.body).toEqual({
      error: { type: "remote db", message: "not implemented" },
    });
  });
});

describe("on invalid payload", () => {
  const { name, date, type } = mockPayload;

  const testConfigOptions: [string, Partial<Meal>][] = [
    ["name", { date, type }],
    ["date", { name, type }],
    ["type", { name, date }],
    ["type, date", { name }],
  ];

  for (const option of testConfigOptions) {
    createMeal.mockReset();
    const [missingProp, body] = option;

    describe(`if ${missingProp} is missing`, () => {
      test("returns 422", async () => {
        const response = await request(app)
          .post("/meals")
          .send({ ...body });

        expect(response.status).toBe(422);
      });

      test("does not call db.createMeal", async () => {
        await request(app)
          .post("/meals")
          .send({ ...body });

        expect(createMeal).not.toHaveBeenCalled();
      });

      test("returns missing props in the error message", async () => {
        const response = await request(app)
          .post("/meals")
          .send({ ...body });

        expect(response.body).toEqual({
          error: {
            message: "missing props",
            data: missingProp.split(", "),
          },
        });
      });
    });
  }
});
