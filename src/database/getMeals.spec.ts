import { Pool } from "pg";
import { getMeals } from "./getMeals";

beforeEach(() => {
  jest.resetAllMocks();
});

test("returns error on query fail", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockRejectedValue({ code: "00000" });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await getMeals(mockClient)();

  expect(response).toEqual({
    data: null,
    error: { type: "database query failed", details: { code: "00000" } },
  });
});

test("returns response rows on query success", async () => {
  const mockClient = new Pool();
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [1, 2, 3],
  });

  mockClient.connect = mockConnect;
  mockClient.query = mockQuery;

  const response = await getMeals(mockClient)();

  expect(response).toEqual({
    data: [1, 2, 3],
    error: null,
  });
});
