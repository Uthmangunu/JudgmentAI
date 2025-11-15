# JudgmentAI Backend Makefile

.PHONY: help setup install dev test clean docker-up docker-down celery format lint

help:
	@echo "JudgmentAI Backend - Available Commands:"
	@echo ""
	@echo "  make setup       - Initial setup (venv, install deps)"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Run development server"
	@echo "  make celery      - Run Celery worker"
	@echo "  make test        - Run tests"
	@echo "  make format      - Format code with black"
	@echo "  make lint        - Lint code with ruff"
	@echo "  make docker-up   - Start Docker services"
	@echo "  make docker-down - Stop Docker services"
	@echo "  make clean       - Clean cache files"
	@echo ""

setup:
	@bash scripts/setup.sh

install:
	pip install -r requirements.txt
	python -m spacy download en_core_web_sm

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

celery:
	celery -A app.tasks.celery_app worker --loglevel=info

celery-beat:
	celery -A app.tasks.celery_app beat --loglevel=info

flower:
	celery -A app.tasks.celery_app flower --port=5555

test:
	pytest tests/ -v --cov=app

test-watch:
	pytest-watch tests/ -v

format:
	black app/ tests/
	ruff check app/ tests/ --fix

lint:
	ruff check app/ tests/
	black app/ tests/ --check

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +

shell:
	python -m IPython

db-migrate:
	@echo "Run this SQL in Supabase SQL Editor:"
	@cat app/db/init_db.sql
