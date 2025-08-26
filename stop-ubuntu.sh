#!/bin/bash

APP_NAME="demo-app"
PID_FILE="$APP_NAME.pid"

echo "🛑 $APP_NAME 중지 중..."

# PID 파일 확인
if [ ! -f "$PID_FILE" ]; then
    echo "⚠️ PID 파일을 찾을 수 없습니다."
    
    # 프로세스 이름으로 찾기 시도
    PID=$(pgrep -f "demo-0.0.1-SNAPSHOT.jar")
    if [ -n "$PID" ]; then
        echo "🔍 실행 중인 프로세스 발견 (PID: $PID)"
        kill $PID
        sleep 3
        if ps -p $PID > /dev/null 2>&1; then
            echo "🔨 강제 종료..."
            kill -9 $PID
        fi
        echo "✅ 애플리케이션 중지 완료"
    else
        echo "ℹ️ 실행 중인 애플리케이션이 없습니다."
    fi
    exit 0
fi

# PID 파일에서 PID 읽기
PID=$(cat "$PID_FILE")

# 프로세스 실행 확인
if ! ps -p $PID > /dev/null 2>&1; then
    echo "⚠️ 프로세스가 실행 중이지 않습니다 (PID: $PID)"
    rm -f "$PID_FILE"
    exit 0
fi

# 정상 종료 시도
echo "🔄 정상 종료 시도... (PID: $PID)"
kill $PID

# 종료 대기 (최대 15초)
for i in {1..15}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "✅ 애플리케이션 정상 종료 완료"
        rm -f "$PID_FILE"
        exit 0
    fi
    sleep 1
    echo "⏳ 종료 대기 중... ($i/15)"
done

# 강제 종료
echo "🔨 강제 종료 중..."
kill -9 $PID
sleep 2

if ! ps -p $PID > /dev/null 2>&1; then
    echo "✅ 애플리케이션 강제 종료 완료"
    rm -f "$PID_FILE"
else
    echo "❌ 애플리케이션 종료 실패"
    exit 1
fi
