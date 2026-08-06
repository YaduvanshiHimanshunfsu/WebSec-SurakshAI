# Multi-stage production Dockerfile for Google Cloud Run, AWS App Runner, Azure Container Apps, Linux, macOS & Windows
# Stage 1: Build React SPA Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend + Static Asset Host
FROM python:3.11-slim AS production

# Prevent Python from writing bytecode & buffering stdout/stderr
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    FLASK_ENV=production

WORKDIR /app

# Install system dependencies for PostgreSQL & networking
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app/ ./app/
COPY config.py run.py ./
COPY payload_templates/ ./payload_templates/

# Copy pre-built React SPA dist folder from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8080

# Run with Gunicorn web server (suitable for Google Cloud Run, AWS, Azure, Linux VMs)
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120 "app:create_app()"
