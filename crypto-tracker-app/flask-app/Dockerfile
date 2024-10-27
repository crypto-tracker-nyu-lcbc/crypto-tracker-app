# syntax=docker/dockerfile:1

FROM python:3.13-slim

# set working directory
WORKDIR /flask-app

EXPOSE 5001

# add and install requirements
COPY requirements.txt .
RUN pip install -r requirements.txt
