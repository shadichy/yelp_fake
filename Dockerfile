# build frontend
FROM node:22-alpine as frontend
WORKDIR /app/frontend
COPY frontend/package*.json /app/frontend/
RUN npm install
COPY frontend/. /app/frontend/
ENV API_ENDPOINT=http://localhost:8000
RUN npm run build

# build backend
FROM python:3.11-slim as backend
WORKDIR /app/backend
COPY backend/requirements.txt /app/backend/
RUN pip install -r requirements.txt
COPY backend/. /app/backend/

# serve
WORKDIR /app
COPY main.py /app/
RUN mkdir /app/frontend
COPY --from=frontend /app/frontend/dist /app/frontend/dist
CMD ["sh", "-c", "export PYTHONPATH=$PYTHONPATH:/app && uvicorn main:app --host 0.0.0.0 --port 8000"]