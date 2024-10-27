# syntax=docker/dockerfile:1

FROM python:3.13-slim

WORKDIR /flask-app

EXPOSE 5001

COPY requirements.txt .
RUN pip install -r requirements.txt
