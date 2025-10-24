#!/bin/bash
echo "Makemigrations"
poetry run python manage.py makemigrations --noinput
echo "==============================="

echo "Migrate"
poetry run python manage.py migrate --noinput
echo "==============================="

echo "Creating car make and models database"
poetry run python manage.py load_vehicles
echo "==============================="

echo "Start server"
exec poetry run python manage.py runserver 0.0.0.0:8000