#!/bin/bash

# Trigger Daily Trick Selection
# This script calls the daily trick API to select a new random tutorial

curl -X POST http://localhost:3000/api/daily-trick

echo "Daily trick selection triggered!"

