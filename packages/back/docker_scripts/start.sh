#!/bin/bash
set -x
MONGO_LOG="/var/log/mongodb/mongod.log"
MONGO="/usr/bin/mongo"
MONGOD="/usr/bin/mongod"
MONGO_SCRIPT="/docker_scripts/mongo_script.js"
$MONGOD --fork --replSet "rs0" --bind_ip_all --logpath $MONGO_LOG
sleep 1

$MONGO --eval "var adminUser = \"$MONGO_USER\"; var adminPass = \"$MONGO_PASS\"" $MONGO_SCRIPT

tail -f $MONGO_LOG
