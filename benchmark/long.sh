#!/bin/bash

for i in {1..100}
do
  curl localhost:5050/long
  # echo $i
  sleep 1
done