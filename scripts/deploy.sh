#!/bin/bash

echo "Running terraform init"
(cd ../terraform/env/dev && terraform init)
wait
echo "Completed terraform init"

echo "Running terraform apply"
(cd ../terraform/env/dev && terraform apply)
wait
echo "Completed terraform apply"

echo "Running npm init"
(cd ../serverless  && npm init)
wait
echo "Completed npm init"

echo "Running npm install"
(cd ../serverless  && npm install)
wait
echo "Completed npm install"

echo "Running sls deploy"
(cd ../serverless && sls deploy)
wait
echo "Completed sls deploy"

echo "Done"