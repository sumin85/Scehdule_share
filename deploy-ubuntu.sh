#!/bin/bash

# Ubuntu 서버 SCP 배포 스크립트
# 사용법: ./deploy-ubuntu.sh <SERVER_IP> <SSH_KEY_PATH> <USERNAME>

if [ $# -lt 2 ]; then
    echo "사용법: $0 <SERVER_IP> <SSH_KEY_PATH> [USERNAME]"
    echo "예시: $0 3.34.123.45 ~/.ssh/my-key.pem ubuntu"
    echo "예시: $0 3.34.123.45 ~/.ssh/my-key.pem"
    exit 1
fi

SERVER_IP=$1
SSH_KEY=$2
USERNAME=${3:-ubuntu}  # 기본값은 ubuntu
JAR_FILE="demo/build/libs/demo-0.0.1-SNAPSHOT.jar"
APP_DIR="/home/$USERNAME/demo-app"

echo "🚀 Spring Boot 애플리케이션을 Ubuntu 서버에 배포합니다..."
echo "📍 서버: $USERNAME@$SERVER_IP"
echo "📁 배포 경로: $APP_DIR"

# JAR 파일 존재 확인
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ JAR 파일을 찾을 수 없습니다: $JAR_FILE"
    echo "먼저 './gradlew build'를 실행하세요."
    exit 1
fi

# SSH 키 파일 확인
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH 키 파일을 찾을 수 없습니다: $SSH_KEY"
    exit 1
fi

# SSH 키 권한 설정
chmod 600 "$SSH_KEY"

echo "🔧 서버 환경 설정 중..."

# 서버에 애플리케이션 디렉토리 생성
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $USERNAME@$SERVER_IP << 'EOF'
# 애플리케이션 디렉토리 생성
mkdir -p ~/demo-app/logs

# Java 17 설치 확인 및 설치
if ! command -v java &> /dev/null; then
    echo "☕ Java 17 설치 중..."
    sudo apt update
    sudo apt install -y openjdk-17-jdk
fi

# 방화벽 설정 (8080 포트 열기)
sudo ufw allow 8080/tcp

echo "✅ 서버 환경 설정 완료"
EOF

# 기존 애플리케이션 중지
echo "🛑 기존 애플리케이션 중지 중..."
ssh -i "$SSH_KEY" $USERNAME@$SERVER_IP "pkill -f 'demo-0.0.1-SNAPSHOT.jar' || true"

# JAR 파일 업로드
echo "📤 JAR 파일 업로드 중..."
scp -i "$SSH_KEY" "$JAR_FILE" $USERNAME@$SERVER_IP:$APP_DIR/

# 실행 스크립트들 업로드
echo "📤 실행 스크립트 업로드 중..."
scp -i "$SSH_KEY" "start-ubuntu.sh" $USERNAME@$SERVER_IP:$APP_DIR/start.sh
scp -i "$SSH_KEY" "stop-ubuntu.sh" $USERNAME@$SERVER_IP:$APP_DIR/stop.sh

# 실행 권한 부여
ssh -i "$SSH_KEY" $USERNAME@$SERVER_IP "chmod +x $APP_DIR/*.sh"

# 애플리케이션 시작
echo "▶️ 애플리케이션 시작 중..."
ssh -i "$SSH_KEY" $USERNAME@$SERVER_IP "cd $APP_DIR && ./start.sh"

echo ""
echo "✅ 배포 완료!"
echo "🌐 애플리케이션 URL: http://$SERVER_IP:8080"
echo "📋 로그 확인: ssh -i $SSH_KEY $USERNAME@$SERVER_IP 'tail -f $APP_DIR/logs/demo-app.log'"
echo "🛑 중지: ssh -i $SSH_KEY $USERNAME@$SERVER_IP 'cd $APP_DIR && ./stop.sh'"
