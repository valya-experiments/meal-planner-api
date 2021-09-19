import request from "supertest";
import { makeApp } from "../app";
import { DatabaseAPI, Meal, MealType } from "../services/database";

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

describe("GET: /meals", () => {
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
});

describe("POST: /meals", () => {
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
});

describe("PATCH /meals/:mealId", () => {
  const mockPayload: Omit<Meal, "id"> = {
    name: "Fajitas",
    type: MealType.Lunch,
    date: "19-07-2021",
  };

  beforeEach(() => {
    updateMeal.mockReset();
    updateMeal.mockResolvedValue({
      error: null,
      data: {
        id: "111",
        ...mockPayload,
      },
    });
  });

  test("returns 200", async () => {
    const response = await request(app)
      .patch("/meals/111")
      .send({ ...mockPayload });

    expect(response.status).toBe(200);
  });

  test("returns JSON header", async () => {
    const response = await request(app)
      .patch("/meals/111")
      .send({ ...mockPayload });

    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  test("calls updateMeal with provided data", async () => {
    await request(app)
      .patch("/meals/111")
      .send({ ...mockPayload });

    expect(updateMeal).toHaveBeenCalledWith({ ...mockPayload, id: "111" });
  });

  test("returns meal provided by database", async () => {
    const response = await request(app)
      .patch("/meals/111")
      .send({ ...mockPayload });

    expect(response.body).toEqual({ ...mockPayload, id: "111" });
  });

  describe("on database error", () => {
    beforeEach(() => {
      updateMeal.mockResolvedValue({
        error: {
          type: "remote db",
          message: "not implemented",
        },
        data: null,
      });
    });

    test("returns 500", async () => {
      const response = await request(app)
        .patch("/meals/111")
        .send({ ...mockPayload });

      expect(response.status).toBe(500);
    });

    test("returns error object", async () => {
      const response = await request(app)
        .patch("/meals/111")
        .send({ ...mockPayload });

      expect(response.body).toEqual({
        error: { type: "remote db", message: "not implemented" },
      });
    });
  });

  describe("on invalid payload", () => {
    test("returns 422", async () => {
      const response = await request(app).patch("/meals/111").send({});

      expect(response.status).toBe(422);
    });

    test("does not call db.updateMeal", async () => {
      await request(app).patch("/meals/111").send({});

      expect(updateMeal).not.toHaveBeenCalled();
    });
  });
});

describe("DELETE /meals/:mealId", () => {
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
});
