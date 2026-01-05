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

echo "Upload media files to cloudinary"
poetry run python manage.py upload_cloudinary
echo "==============================="

# Uruchom Celery w tle
echo "Starting Celery worker..."
poetry run celery -A backend worker --loglevel=info --detach

echo "Starting Celery beat..."
poetry run celery -A backend beat --loglevel=info --detach

echo "Start server"
# Gunicorn: 4 workerów, bind do portu Render
exec poetry run gunicorn backend.wsgi:application \
    --bind 0.0.0.0:${PORT} \
    --workers 4 \
    --log-level info \
    --limit-request-field_size 0 \
    --limit-request-line 0
