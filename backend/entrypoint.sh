#!/bin/bash
echo "Makemigrations"
poetry run python manage.py makemigrations core --noinput
echo "==============================="

echo "Migrate"
poetry run python manage.py migrate --noinput
echo "==============================="

echo "Start server"
exec poetry run python manage.py runserver 0.0.0.0:8000