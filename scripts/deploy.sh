#!/bin/bash

echo "Running terraform init"
(cd ../terraform/env/dev && terraform init)
echo "Completed terraform init"
wait
echo "Running terraform apply"
(cd ../terraform/env/dev && terraform apply)
echo "Completed terraform apply"
wait
echo "Running npm install"
(cd .../serverless  && npm install)
echo "Completed npm install"
wait
echo "Running sls deploy"
(cd ../serverless && sls deploy)
wait
echo "Completed sls deploy"
echo "Done"