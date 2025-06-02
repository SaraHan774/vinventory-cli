#!/bin/bash
export JAVA_OPTS="-Xmx2g -Xms512m -XX:MaxMetaspaceSize=512m"
./gradlew run 