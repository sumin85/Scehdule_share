#!/usr/bin/env bash

# 로그 디렉토리 생성
mkdir -p /home/ubuntu/app/logs
chown -R ubuntu:ubuntu /home/ubuntu/app

# 시스템 업데이트
apt-get update -y

# Java 17 설치 확인 및 설치
if ! java -version 2>&1 | grep -q "17"; then
    echo "Installing Java 17..."
    apt-get install -y openjdk-17-jdk
fi

# JAVA_HOME 설정
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> /home/ubuntu/.bashrc

# CodeDeploy 에이전트 설치 확인
if ! systemctl is-active --quiet codedeploy-agent; then
    echo "Installing CodeDeploy agent..."
    apt-get install -y ruby wget
    cd /home/ubuntu
    wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install
    chmod +x ./install
    ./install auto
    systemctl start codedeploy-agent
    systemctl enable codedeploy-agent
fi

# 스크립트 실행 권한 설정
chmod +x /home/ubuntu/app/scripts/*.sh

echo "Dependencies installation completed"
