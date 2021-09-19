import { Pool } from "pg";
import { MealType } from ".";
import { deleteMeal } from "./deleteMeal";

const mockRequestPayload = "12345";
const mockResponsePayload = {
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

  const response = await deleteMeal(mockClient)(mockRequestPayload);

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

  await deleteMeal(mockClient)(mockRequestPayload);

  expect(mockQuery.mock.calls[0][0]).toBe(
    `DELETE FROM public."Meals" WHERE "id"=$1;`
  );
  expect(mockQuery.mock.calls[0][1]).toEqual([mockRequestPayload]);
});

test("returns meal object on query success", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        ...mockResponsePayload,
      },
    ],
  });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await deleteMeal(mockClient)(mockRequestPayload);

  expect(response).toEqual({
    data: {
      ...mockResponsePayload,
    },
    error: null,
  });
});
