# Development Plan - API
See test suite for endpoints description

* [x] API Endpoints
    * [x] GET /meals
    * [x] POST /meals
    * [x] PATCH /meals
    * [x] DELETE /meals

* [x] Database calls
    * [x] getMeals
    * [x] createMeal
    * [x] updateMeal
    * [x] deleteMeal

* [x] integration test
    * [x] run local db
    * [x] create tables
    * [x] seed MealTypes table
    * [x] setup testing env (connection string)
    * [x] run tests with supertest

* [x] Docker config for API

## Chores
    * [x] configure husky
    * [ ] configure CI (Github actions)
    * [ ] configure renovate bot

## Tech Debt
* [x] concatenated db queries are vlunerable to SQL injection
      use params instead, e.g.:

      ```javascript
      const text = `DELETE FROM people WHERE id = $1`;
      const values = [personId];
      return dbClient.query(text, values);
