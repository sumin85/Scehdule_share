#!/bin/bash

APP_NAME="demo-app"
JAR_FILE="demo-0.0.1-SNAPSHOT.jar"
PID_FILE="$APP_NAME.pid"
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/demo-app.log"

echo "🚀 $APP_NAME 시작 중..."

# 로그 디렉토리 생성
mkdir -p "$LOG_DIR"

# 이미 실행 중인지 확인
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️ 애플리케이션이 이미 실행 중입니다 (PID: $PID)"
        echo "🌐 URL: http://localhost:8080"
        exit 1
    else
        echo "🧹 오래된 PID 파일 제거..."
        rm -f "$PID_FILE"
    fi
fi

# Java 설치 확인
if ! command -v java &> /dev/null; then
    echo "❌ Java가 설치되지 않았습니다."
    echo "Ubuntu에서 Java 17 설치:"
    echo "sudo apt update"
    echo "sudo apt install -y openjdk-17-jdk"
    exit 1
fi

# JAR 파일 존재 확인
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ JAR 파일을 찾을 수 없습니다: $JAR_FILE"
    exit 1
fi

# Java 버전 확인
JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2 | cut -d'.' -f1)
echo "☕ Java 버전: $JAVA_VERSION"

# 애플리케이션 시작
echo "▶️ 애플리케이션 시작..."
nohup java -jar \
    -Dspring.profiles.active=prod \
    -Xms512m -Xmx1024m \
    -Dserver.port=8080 \
    "$JAR_FILE" > "$LOG_FILE" 2>&1 &

# PID 저장
echo $! > "$PID_FILE"

sleep 5

# 시작 확인
if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
    PID=$(cat "$PID_FILE")
    echo "✅ $APP_NAME 시작 완료! (PID: $PID)"
    echo "📋 로그 확인: tail -f $LOG_FILE"
    echo "🌐 URL: http://localhost:8080"
    echo "🔍 상태 확인: curl http://localhost:8080/actuator/health"
else
    echo "❌ 애플리케이션 시작 실패"
    echo "📋 로그 확인:"
    tail -20 "$LOG_FILE"
    exit 1
fi
