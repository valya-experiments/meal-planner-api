make test-db-up

yarn test ${PWD}/src/integration-tests/ --testPathIgnorePatterns [],

make test-db-down
