@"
#!/usr/bin/env bash

PROJECT_ROOT=/home/ubuntu/app
JAR_FILE=$PROJECT_ROOT/demo-0.0.1-SNAPSHOT.jar

DEPLOY_LOG=$PROJECT_ROOT/logs/deploy.log

TIME_NOW=$(date +"%Y-%m-%d %H:%M:%S")

echo "$TIME_NOW > 애플리케이션 종료 중..." >> $DEPLOY_LOG

CURRENT_PID=$(pgrep -f $JAR_FILE)

if [ -z "$CURRENT_PID" ]; then
    echo "$TIME_NOW > 실행 중인 애플리케이션이 없습니다." >> $DEPLOY_LOG
else
    echo "$TIME_NOW > 실행 중인 애플리케이션 종료 $CURRENT_PID" >> $DEPLOY_LOG
    kill -15 $CURRENT_PID
    sleep 5
    
    # 강제 종료가 필요한 경우
    if pgrep -f $JAR_FILE > /dev/null; then
        echo "$TIME_NOW > 강제 종료 실행" >> $DEPLOY_LOG
        kill -9 $CURRENT_PID
    fi
fi
"@ | Out-File -FilePath "scripts\stop.sh" -Encoding UTF8