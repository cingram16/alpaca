#!/bin/bash

echo "Running sls remove"
(cd ../serverless && sls remove)
wait
echo "Completed sls remove"
echo "Running terraform destroy"
(cd ../terraform/env/dev && terraform destroy)
echo "Completed terraform destroy"
echo "Done"