#!/bin/bash

export DOCKER_HOST_IP=$(more /etc/hosts|awk '/docker_host/ {print $1}')

rm -rf node_modules

npm install

npm install broker-manager-0.2.1.tgz

node app.js
