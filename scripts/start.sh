#!/usr/bin/env bash

PROJECT_ROOT=/home/ubuntu/app
JAR_FILE=$PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar

APP_LOG=$PROJECT_ROOT/logs/app.log
ERROR_LOG=$PROJECT_ROOT/logs/error.log
DEPLOY_LOG=$PROJECT_ROOT/logs/deploy.log

TIME_NOW=$(date +"%Y-%m-%d %H:%M:%S")

# 로그 디렉토리 생성 (먼저 실행)
mkdir -p $PROJECT_ROOT/logs

# 시스템 정리 먼저 실행
echo "$TIME_NOW > 시스템 정리 먼저 실행..." >> $DEPLOY_LOG
if [ -f /home/ubuntu/app/scripts/cleanup.sh ]; then
    /home/ubuntu/app/scripts/cleanup.sh
    if [ $? -ne 0 ]; then
        echo "$TIME_NOW > ERROR: cleanup.sh 실행 실패" >> $DEPLOY_LOG
        exit 1
    fi
else
    echo "$TIME_NOW > WARNING: cleanup.sh 파일이 존재하지 않습니다" >> $DEPLOY_LOG
fi

# 기존 프로세스 종료
echo "$TIME_NOW > 기존 프로세스 종료..." >> $DEPLOY_LOG
pkill -f 'java.*demo.*jar' || true
sleep 5

# Java 경로 설정 및 확인
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Java 설치 확인
if ! command -v java &> /dev/null; then
    echo "$TIME_NOW > ERROR: Java가 설치되지 않았거나 PATH에 없습니다" >> $DEPLOY_LOG
    exit 1
fi

# 메모리 최적화된 JVM 옵션 설정
export JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+DisableExplicitGC -Djava.awt.headless=true"

echo "$TIME_NOW > 애플리케이션 시작 중..." >> $DEPLOY_LOG

# JAR 파일 찾기 - 경로 수정
JAR_FILE=$(find $PROJECT_ROOT -name "*.jar" -type f -not -path "*/gradle/wrapper/*" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "$TIME_NOW > ERROR: JAR 파일을 찾을 수 없습니다" >> $DEPLOY_LOG
    echo "$TIME_NOW > 검색 경로: $PROJECT_ROOT" >> $DEPLOY_LOG
    echo "$TIME_NOW > 디렉토리 내용:" >> $DEPLOY_LOG
    ls -la $PROJECT_ROOT >> $DEPLOY_LOG 2>&1
    find $PROJECT_ROOT -name "*.jar" -type f >> $DEPLOY_LOG 2>&1
    exit 1
fi

echo "$TIME_NOW > 발견된 JAR 파일: $JAR_FILE" >> $DEPLOY_LOG

# JAR 파일 유효성 검사
if [ ! -f "$JAR_FILE" ]; then
    echo "$TIME_NOW > ERROR: JAR 파일이 존재하지 않습니다: $JAR_FILE" >> $DEPLOY_LOG
    exit 1
fi

# JAR 파일 복사
echo "$TIME_NOW > JAR 파일 복사 중..." >> $DEPLOY_LOG
cp "$JAR_FILE" "$PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar"
if [ $? -ne 0 ]; then
    echo "$TIME_NOW > ERROR: JAR 파일 복사 실패" >> $DEPLOY_LOG
    exit 1
fi

# Java 버전 확인
echo "$TIME_NOW > Java 버전:" >> $DEPLOY_LOG
java -version >> $DEPLOY_LOG 2>&1

# 포트 8080 사용 중인지 확인
if netstat -tuln | grep -q ":8080 "; then
    echo "$TIME_NOW > WARNING: 포트 8080이 이미 사용 중입니다" >> $DEPLOY_LOG
    echo "$TIME_NOW > 포트 8080 사용 프로세스:" >> $DEPLOY_LOG
    netstat -tuln | grep ":8080 " >> $DEPLOY_LOG 2>&1
    lsof -i :8080 >> $DEPLOY_LOG 2>&1 || true
fi

echo "$TIME_NOW > 애플리케이션 실행 중..." >> $DEPLOY_LOG
nohup java $JAVA_OPTS -jar $PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar > $APP_LOG 2> $ERROR_LOG &

sleep 5

# 프로세스 확인
CURRENT_PID=$(pgrep -f "demo-0.0.1-SNAPSHOT.jar")
if [ ! -z "$CURRENT_PID" ]; then
    echo "$TIME_NOW > 애플리케이션 시작 성공. PID: $CURRENT_PID" >> $DEPLOY_LOG
    echo "$TIME_NOW > 포트 8080 리스닝 확인:" >> $DEPLOY_LOG
    netstat -tuln | grep ":8080 " >> $DEPLOY_LOG 2>&1 || echo "$TIME_NOW > 포트 8080이 아직 리스닝되지 않음" >> $DEPLOY_LOG
else
    echo "$TIME_NOW > ERROR: 애플리케이션 시작 실패" >> $DEPLOY_LOG
    echo "$TIME_NOW > 애플리케이션 로그 확인:" >> $DEPLOY_LOG
    if [ -f "$APP_LOG" ]; then
        echo "$TIME_NOW > === APP LOG ===" >> $DEPLOY_LOG
        tail -20 "$APP_LOG" >> $DEPLOY_LOG 2>&1
    fi
    if [ -f "$ERROR_LOG" ]; then
        echo "$TIME_NOW > === ERROR LOG ===" >> $DEPLOY_LOG
        tail -20 "$ERROR_LOG" >> $DEPLOY_LOG 2>&1
    fi
    exit 1
fi