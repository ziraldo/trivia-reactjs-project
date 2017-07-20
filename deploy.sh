#!/bin/bash

set -e

echo "-- Cleaning"
rm -rf build

echo "-- Building"
npm run build

echo "-- Deploying"
aws s3 sync build/ s3://aws-website-trivia-reactjs-project-6o64y --delete

echo "-- Done"
