// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { Pool } from "pg";
import { getEnvVar } from "./utils/getEnvVar";
import { makeApp } from "./app";
import { makeDatabase } from "./database";

const connectionString = getEnvVar("DB_CONNECTION_STRING");

const dbClient = new Pool({ connectionString });

const app = makeApp(makeDatabase(dbClient));

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`Meal planner is running at port ${PORT}`);
});
