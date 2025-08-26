# Ubuntu 서버 배포 가이드

Spring Boot 애플리케이션을 Ubuntu 서버에 SCP로 배포하는 방법입니다.

## 📋 사전 준비사항

1. **Ubuntu 서버** (AWS EC2, GCP, Azure 등)
2. **SSH 키 파일** (.pem 또는 개인키)
3. **빌드된 JAR 파일** (`./gradlew build` 실행 완료)

## 🚀 배포 방법

### 1단계: 애플리케이션 빌드
```bash
cd demo
./gradlew build
```

### 2단계: 배포 스크립트 실행
```bash
# 기본 ubuntu 사용자로 배포
./deploy-ubuntu.sh <서버IP> <SSH키경로>

# 예시
./deploy-ubuntu.sh 3.34.123.45 ~/.ssh/my-key.pem

# 다른 사용자명 사용시
./deploy-ubuntu.sh 3.34.123.45 ~/.ssh/my-key.pem myuser
```

## 🔧 서버에서 직접 관리

### SSH 접속
```bash
ssh -i ~/.ssh/my-key.pem ubuntu@3.34.123.45
cd ~/demo-app
```

### 애플리케이션 제어
```bash
# 시작
./start.sh

# 중지
./stop.sh

# 상태 확인
ps aux | grep demo

# 로그 확인
tail -f logs/demo-app.log
```

## 🌐 접속 확인

배포 완료 후 브라우저에서 접속:
```
http://서버IP:8080
```

Health Check:
```bash
curl http://서버IP:8080/actuator/health
```

## 🔍 문제 해결

### Java 수동 설치
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk
java -version
```

### 방화벽 설정
```bash
# 8080 포트 열기
sudo ufw allow 8080/tcp
sudo ufw status
```

### 포트 사용 확인
```bash
# 8080 포트 사용 프로세스 확인
sudo netstat -tlnp | grep :8080
sudo lsof -i :8080
```

### 프로세스 강제 종료
```bash
# 모든 demo 관련 프로세스 종료
pkill -f demo-0.0.1-SNAPSHOT.jar

# 특정 PID 종료
kill -9 <PID>
```

## 📁 파일 구조

배포 후 서버의 파일 구조:
```
~/demo-app/
├── demo-0.0.1-SNAPSHOT.jar  # 애플리케이션 JAR
├── start.sh                 # 시작 스크립트
├── stop.sh                  # 중지 스크립트
├── demo-app.pid             # 프로세스 ID 파일
└── logs/
    └── demo-app.log         # 애플리케이션 로그
```

## 🔄 재배포

새 버전 배포시 다시 `deploy-ubuntu.sh` 실행하면 자동으로:
1. 기존 애플리케이션 중지
2. 새 JAR 파일 업로드
3. 애플리케이션 재시작
