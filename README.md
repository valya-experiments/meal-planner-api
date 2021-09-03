# Meal Planner API

[![CI](https://github.com/valya-experiments/meal-planner-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/valya-experiments/meal-planner-api/actions/workflows/ci.yml)

A CRUD API endpoint with persisted data.

## Tech Stack
* ExpressJS (Typescript)
* Postgres DB (via [Elephant SQL](https://www.elephantsql.com/))

## Testing
* unit tests wih jest and supertest (`yarn test`)
* integration tests with local DB(using Docker) and supertest (`yarn test:int`)
    * the file `src/integration-tests/execute.sh` must be made executable
    * docker and docker-compose are required for running DB locally

## CI
* checks are run locally via pre-commit and pre-push hooks configured with husky
* github actions also run checks on merge and push to main branch

## Deployment
The app is dockerized using docker-compose

