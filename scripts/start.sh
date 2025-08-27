#!/usr/bin/env bash

PROJECT_ROOT=/home/ubuntu/app
JAR_FILE=$PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar

APP_LOG=$PROJECT_ROOT/logs/app.log
ERROR_LOG=$PROJECT_ROOT/logs/error.log
DEPLOY_LOG=$PROJECT_ROOT/logs/deploy.log

TIME_NOW=$(date +"%Y-%m-%d %H:%M:%S")

# 시스템 정리 먼저 실행
echo "$TIME_NOW > 시스템 정리 먼저 실행..." >> $DEPLOY_LOG
/home/ubuntu/app/scripts/cleanup.sh

# 기존 프로세스 종료
echo "$TIME_NOW > 기존 프로세스 종료..." >> $DEPLOY_LOG
pkill -f 'java.*demo.*jar' || true
sleep 5

# 로그 디렉토리 생성
mkdir -p $PROJECT_ROOT/logs

# Java 경로 설정
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# 메모리 최적화된 JVM 옵션 설정
export JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+DisableExplicitGC -Djava.awt.headless=true"

echo "$TIME_NOW > 애플리케이션 시작 중..." >> $DEPLOY_LOG

# JAR 파일 찾기 - 경로 수정
JAR_FILE=$(find $PROJECT_ROOT -name "*.jar" -type f -not -path "*/gradle/wrapper/*" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "$TIME_NOW > ERROR: JAR 파일을 찾을 수 없습니다" >> $DEPLOY_LOG
    echo "$TIME_NOW > 검색 경로: $PROJECT_ROOT" >> $DEPLOY_LOG
    ls -la $PROJECT_ROOT >> $DEPLOY_LOG
    exit 1
fi

echo "$TIME_NOW > 발견된 JAR 파일: $JAR_FILE" >> $DEPLOY_LOG
echo "$TIME_NOW > JAR 파일 복사 중..." >> $DEPLOY_LOG
cp $JAR_FILE $PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar

# Java 버전 확인
java -version >> $DEPLOY_LOG 2>&1

echo "$TIME_NOW > 애플리케이션 실행 중..." >> $DEPLOY_LOG
nohup java $JAVA_OPTS -jar $PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar > $APP_LOG 2> $ERROR_LOG &

sleep 3

CURRENT_PID=$(pgrep -f "demo-0.0.1-SNAPSHOT.jar")
if [ ! -z "$CURRENT_PID" ]; then
    echo "$TIME_NOW > 애플리케이션 시작 성공. PID: $CURRENT_PID" >> $DEPLOY_LOG
else
    echo "$TIME_NOW > ERROR: 애플리케이션 시작 실패" >> $DEPLOY_LOG
    exit 1
fi