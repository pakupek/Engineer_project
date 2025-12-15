FROM python:3.12-slim

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        libcairo2-dev \
        pkg-config \
        python3-dev \
        dos2unix \
    && apt-get clean

COPY backend/pyproject.toml backend/poetry.lock ./
COPY backend/entrypoint.sh ./

RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir poetry \
    && poetry install --only main --no-interaction --no-root \
    && pip install --no-cache-dir playwright \
    && playwright install --with-deps
# Copy the rest of the project including entrypoint.sh
COPY backend/ ./

# Fix line endings and permissions for entrypoint
RUN dos2unix entrypoint.sh \
    && chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
