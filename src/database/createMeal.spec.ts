import { Pool } from "pg";
import { MealType } from ".";
import { createMeal } from "./createMeal";

const mockRequestPayload = {
  name: "Fajitas",
  type: MealType.Lunch,
  date: "19-07-2021",
};

test("returns error on query fail", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockRejectedValue({ code: "00000" });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await createMeal(mockClient)({ ...mockRequestPayload });

  expect(response).toEqual({
    data: null,
    error: { type: "database query failed", details: { code: "00000" } },
  });
});

test("forms DB query with payload values", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue(true);

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  await createMeal(mockClient)({ ...mockRequestPayload });

  const { name, date, type } = mockRequestPayload;

  expect(mockQuery.mock.calls[0][0]).toBe(
    `INSERT INTO public."Meals"( "name", "date", "type") VALUES ( $1, $2, $3) RETURNING "id";`
  );
  expect(mockQuery.mock.calls[0][1]).toEqual([name, date, type]);
});

test("returns meal id on query success", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        id: "12345",
      },
    ],
  });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await createMeal(mockClient)({ ...mockRequestPayload });

  expect(response).toEqual({
    data: {
      ...mockRequestPayload,
      id: "12345",
    },
    error: null,
  });
});
