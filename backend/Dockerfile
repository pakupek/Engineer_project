# Use python image
FROM python:3.12
 
# Set the working directory inside the container
WORKDIR /backend
 
# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 
 
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
    && apt-get clean

COPY pyproject.toml poetry.lock ./

RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir poetry \
    && poetry install --only main --no-interaction --no-root

COPY entrypoint.sh ./

RUN chmod +x ./entrypoint.sh

COPY . .

EXPOSE 8000

ENTRYPOINT ["/app/backend/entrypoint.sh"]