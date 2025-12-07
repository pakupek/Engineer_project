#!/bin/bash
set -e  # zatrzymaj przy pierwszym błędzie

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
# Gunicorn: 4 workerów, bind do portu Render
exec poetry run gunicorn backend.wsgi:application \
    --bind 0.0.0.0:${PORT} \
    --workers 4 \
    --log-level info
