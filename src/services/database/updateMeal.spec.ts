import { Pool } from "pg";
import { MealType } from ".";
import { updateMeal } from "./updateMeal";

const mockRequestPayload = {
  name: "Fajitas",
  type: MealType.Lunch,
  date: "19-07-2021",
  id: "12345",
};

test("returns error on query fail", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockRejectedValue({ code: "00000" });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await updateMeal(mockClient)({ ...mockRequestPayload });

  expect(response).toEqual({
    data: null,
    error: { type: "database query failed", details: { code: "00000" } },
  });
});

test("forms DB query using payload values", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue(true);

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  await updateMeal(mockClient)({ ...mockRequestPayload });

  const { id, name, date, type } = mockRequestPayload;

  expect(mockQuery.mock.calls[0][0]).toBe(
    `UPDATE public."Meals" SET name=$1, date=$2, type=$3 WHERE id=$4;`
  );
  expect(mockQuery.mock.calls[0][1]).toEqual([name, date, type, id]);
});

test("returns meal object on query success", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        ...mockRequestPayload,
      },
    ],
  });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await updateMeal(mockClient)({ ...mockRequestPayload });

  expect(response).toEqual({
    data: {
      ...mockRequestPayload,
    },
    error: null,
  });
});
