#!/usr/bin/env bash

# 에러 발생 시 스크립트 중단
set -e

# 로그 디렉토리 생성
mkdir -p /home/ubuntu/app/logs
chown -R ubuntu:ubuntu /home/ubuntu/app

# 시스템 업데이트 (타임아웃 설정)
echo "Updating package lists..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y --timeout=120 || {
    echo "Package update failed, continuing with existing packages..."
}

# Java 17 설치 확인 및 설치
if ! java -version 2>&1 | grep -q "17"; then
    echo "Installing Java 17..."
    apt-get install -y --timeout=180 openjdk-17-jdk
else
    echo "Java 17 already installed"
fi

# JAVA_HOME 설정
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
if ! grep -q "JAVA_HOME" /home/ubuntu/.bashrc; then
    echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> /home/ubuntu/.bashrc
fi

# CodeDeploy 에이전트 설치 확인
if ! systemctl is-active --quiet codedeploy-agent; then
    echo "Installing CodeDeploy agent..."
    apt-get install -y --timeout=120 ruby wget
    cd /home/ubuntu
    
    # CodeDeploy 에이전트 다운로드 (타임아웃 설정)
    wget --timeout=60 --tries=3 https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install || {
        echo "Failed to download CodeDeploy agent installer"
        exit 1
    }
    
    chmod +x ./install
    ./install auto
    systemctl start codedeploy-agent
    systemctl enable codedeploy-agent
else
    echo "CodeDeploy agent already running"
fi

# 스크립트 실행 권한 설정
if [ -d "/home/ubuntu/app/scripts" ]; then
    chmod +x /home/ubuntu/app/scripts/*.sh
fi

echo "Dependencies installation completed successfully"
