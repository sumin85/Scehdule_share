#!/usr/bin/env bash

PROJECT_ROOT=/home/ubuntu/app
JAR_FILE=$PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar

APP_LOG=$PROJECT_ROOT/logs/app.log
ERROR_LOG=$PROJECT_ROOT/logs/error.log
DEPLOY_LOG=$PROJECT_ROOT/logs/deploy.log

TIME_NOW=$(date +"%Y-%m-%d %H:%M:%S")

# Java 경로 설정
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

echo "$TIME_NOW > 애플리케이션 시작 중..." >> $DEPLOY_LOG

# 기존 프로세스 종료
CURRENT_PID=$(pgrep -f $JAR_FILE)
if [ ! -z "$CURRENT_PID" ]; then
    echo "$TIME_NOW > 기존 프로세스 종료: $CURRENT_PID" >> $DEPLOY_LOG
    kill -15 $CURRENT_PID
    sleep 5
fi

# JAR 파일 존재 확인
if [ ! -f "$PROJECT_ROOT/demo/build/libs/demo-0.0.1-SNAPSHOT.jar" ]; then
    echo "$TIME_NOW > ERROR: JAR 파일을 찾을 수 없습니다" >> $DEPLOY_LOG
    exit 1
fi

echo "$TIME_NOW > JAR 파일 복사 중..." >> $DEPLOY_LOG
cp $PROJECT_ROOT/demo/build/libs/*.jar $JAR_FILE

# Java 버전 확인
java -version >> $DEPLOY_LOG 2>&1

echo "$TIME_NOW > 애플리케이션 실행 중..." >> $DEPLOY_LOG
nohup java -jar $JAR_FILE > $APP_LOG 2> $ERROR_LOG &

sleep 3

CURRENT_PID=$(pgrep -f $JAR_FILE)
if [ ! -z "$CURRENT_PID" ]; then
    echo "$TIME_NOW > 애플리케이션 시작 성공. PID: $CURRENT_PID" >> $DEPLOY_LOG
else
    echo "$TIME_NOW > ERROR: 애플리케이션 시작 실패" >> $DEPLOY_LOG
    exit 1
fi