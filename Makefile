#!/usr/bin/make
#----------- Make Environment ----------------------
.DEFAULT_GOAL := help
SHELL= /bin/bash
docker_bin= $(shell command -v docker 2> /dev/null)
docker_compose_bin= $(shell command -v docker-compose 2> /dev/null)

install: ## Install node_modules dependencies
	$(docker_compose_bin) -f docker-compose.yml run --rm --user="1000:1000" app npm install
	$(docker_compose_bin) -f docker-compose.yml run --rm --user="1000:1000" scrapper npm install
build: ## Build node_modules dependencies
	$(docker_compose_bin) -f docker-compose.yml run --rm --user="1000:1000" app npm run build
	$(docker_compose_bin) -f docker-compose.yml run --rm --user="1000:1000" scrapper npm run build scrapper
up: ## Run containers
	$(docker_compose_bin) -f docker-compose.yml up -d
down: ## Stop containers
	$(docker_compose_bin) -f docker-compose.yml down
restart: ## Restart containers
	$(docker_compose_bin) -f docker-compose.yml restart
sh-node: ## bash in node container
	$(docker_compose_bin) -f docker-compose.yml run --rm --user="1000:1000" app bash
deploy: install build restart ## Deploy
