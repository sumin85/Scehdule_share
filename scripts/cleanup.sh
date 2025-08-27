#!/usr/bin/env bash
set -e

echo "Starting cleanup process..."

# 기존 Java 프로세스 정리
echo "Stopping existing Java processes..."
pkill -f 'java.*demo.*jar' || true
sleep 3

# 포트 8080 사용 중인 프로세스 정리
echo "Checking port 8080..."
if lsof -ti:8080 >/dev/null 2>&1; then
    echo "Killing process using port 8080..."
    kill -9 $(lsof -ti:8080) || true
    sleep 2
fi

# 임시 파일 정리
echo "Cleaning temporary files..."
rm -rf /tmp/demo-* || true
rm -rf /tmp/spring-boot-* || true

# 기존 애플리케이션 디렉토리 정리
if [ -d "/home/ubuntu/app" ]; then
    echo "Cleaning application directory..."
    # 로그 파일 백업 (크기가 큰 것만)
    if [ -d "/home/ubuntu/app/logs" ]; then
        find /home/ubuntu/app/logs -name "*.log" -size +100M -exec rm -f {} \; || true
    fi
    
    # 기존 JAR 파일 정리
    rm -f /home/ubuntu/app/*.jar || true
fi

# 디스크 공간 확보
echo "Cleaning system cache..."
apt-get clean || true
rm -rf /var/cache/apt/archives/*.deb || true

echo "Cleanup completed successfully"
