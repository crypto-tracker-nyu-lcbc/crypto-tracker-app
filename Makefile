COMPOSE_FILE = compose.yaml

all: build up

up:
	docker-compose -f $(COMPOSE_FILE) up
	
stop:
	docker-compose -f $(COMPOSE_FILE) stop
	
start:
	docker-compose -f $(COMPOSE_FILE) start
	
down:
	docker-compose -f $(COMPOSE_FILE) down

build:
	docker-compose -f $(COMPOSE_FILE) build

clean:
	docker system prune -a --volumes
	
cli:
	docker exec -it database sqlite3