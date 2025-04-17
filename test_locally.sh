#!/bin/bash

# Build the layer
cd layer
finch build -t font-layer .
finch run --rm -v $(pwd):/output font-layer cp /layer.zip /output/
cd ..

# Create a test directory structure
mkdir -p /tmp/lambda-test/{fonts,lib64}
unzip layer/layer.zip -d /tmp/lambda-test

# Run the function locally using Docker/Finch
finch run --rm \
  -v $(pwd)/src:/var/task \
  -v /tmp/lambda-test/fonts:/opt/fonts \
  -v /tmp/lambda-test/lib64:/opt/lib64 \
  -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  -e AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN} \
  -e S3_BUCKET_NAME=${S3_BUCKET_NAME} \
  public.ecr.aws/lambda/python:3.12 \
  lambda_function.lambda_handler \
  "$(cat tests/events/test_event.json)"

