test-db-up:
	docker-compose --file './src/integration-tests/docker-compose.yml' up -d

test-db-down:
	docker-compose --file './src/integration-tests/docker-compose.yml' down

api-up:
	docker-compose up --build -d

api-down:
	docker-compose down
