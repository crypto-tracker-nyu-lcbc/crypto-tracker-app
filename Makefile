COMPOSE_FILE = compose.yaml

up:
	docker-compose -f $(COMPOSE_FILE) up -d
	
stop:
	docker-compose -f $(COMPOSE_FILE) stop
	
start:
	docker-compose -f $(COMPOSE_FILE) start
	
down:
	docker-compose -f $(COMPOSE_FILE) down
	
cli:
	docker exec -it database sqlite3
