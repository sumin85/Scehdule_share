@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 프로젝트 경로 설정
set "PROJECT_ROOT=%~dp0"
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"
set "DEMO_DIR=%PROJECT_ROOT%\demo"
set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"

:: 로그 파일 설정
set "DEPLOY_LOG=%PROJECT_ROOT%\logs\deploy.log"
set "APP_LOG=%PROJECT_ROOT%\logs\app.log"
set "ERROR_LOG=%PROJECT_ROOT%\logs\error.log"

:: 로그 디렉토리 생성
if not exist "%PROJECT_ROOT%\logs" mkdir "%PROJECT_ROOT%\logs"

:: 현재 시간 설정
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIME_NOW=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%"

echo ========================================
echo 스케줄 공유 애플리케이션 시작
echo ========================================
echo %TIME_NOW% ^> 배포 시작 >> "%DEPLOY_LOG%"

echo 디버그: PROJECT_ROOT=%PROJECT_ROOT%
echo 디버그: DEMO_DIR=%DEMO_DIR%
echo 디버그: FRONTEND_DIR=%FRONTEND_DIR%

:: Node.js 확인
echo 디버그: Node.js 확인 중...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 디버그: Node.js 확인 실패
    echo %TIME_NOW% ^> 오류: Node.js가 설치되지 않았거나 PATH에 없습니다 >> "%DEPLOY_LOG%"
    echo 오류: Node.js가 설치되지 않았거나 PATH에 없습니다
    echo Node.js를 설치하고 PATH에 추가해주세요
    pause
    exit /b 1
)
echo 디버그: Node.js 확인 완료

:: Java 확인
echo 디버그: Java 확인 중...
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 디버그: Java 확인 실패
    echo %TIME_NOW% ^> 오류: Java가 설치되지 않았거나 PATH에 없습니다 >> "%DEPLOY_LOG%"
    echo 오류: Java가 설치되지 않았거나 PATH에 없습니다
    echo Java 17 이상을 설치하고 PATH에 추가해주세요
    pause
    exit /b 1
)
echo 디버그: Java 확인 완료

:: 기존 Java 프로세스 종료
echo %TIME_NOW% ^> 기존 Java 프로세스 종료 중... >> "%DEPLOY_LOG%"
echo 기존 Java 프로세스 종료 중...
taskkill /f /im java.exe >nul 2>&1

:: 프론트엔드 빌드
echo %TIME_NOW% ^> 프론트엔드 빌드 시작... >> "%DEPLOY_LOG%"
echo 프론트엔드 빌드 중...
cd /d "%FRONTEND_DIR%"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> 오류: 프론트엔드 빌드 실패 >> "%DEPLOY_LOG%"
    echo 프론트엔드 빌드 실패!
    pause
    exit /b 1
)
echo 디버그: 프론트엔드 빌드 완료

:: 빌드된 파일을 Spring Boot static 폴더로 복사
echo %TIME_NOW% ^> 빌드 파일 복사 중... >> "%DEPLOY_LOG%"
echo 빌드 파일 복사 중...
if exist "%DEMO_DIR%\src\main\resources\static" rmdir /s /q "%DEMO_DIR%\src\main\resources\static"
xcopy "%FRONTEND_DIR%\build\*" "%DEMO_DIR%\src\main\resources\static\" /e /i /y >nul
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> 오류: 파일 복사 실패 >> "%DEPLOY_LOG%"
    echo 파일 복사 실패!
    pause
    exit /b 1
)
echo 디버그: 파일 복사 완료

:: Spring Boot 애플리케이션 빌드
echo %TIME_NOW% ^> Spring Boot 애플리케이션 빌드 중... >> "%DEPLOY_LOG%"
echo Spring Boot 애플리케이션 빌드 중...
cd /d "%DEMO_DIR%"
call gradlew.bat build -x test
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> 오류: Spring Boot 빌드 실패 >> "%DEPLOY_LOG%"
    echo Spring Boot 빌드 실패!
    pause
    exit /b 1
)
echo 디버그: Spring Boot 빌드 완료

:: JAR 파일 찾기
echo %TIME_NOW% ^> JAR 파일 검색 중... >> "%DEPLOY_LOG%"
set "JAR_FILE=%DEMO_DIR%\build\libs\demo-0.0.1-SNAPSHOT.jar"

if not exist "%JAR_FILE%" (
    echo %TIME_NOW% ^> 오류: 실행 가능한 JAR 파일을 찾을 수 없습니다: ^"%JAR_FILE%^" >> "%DEPLOY_LOG%"
    echo 오류: 실행 가능한 JAR 파일을 찾을 수 없습니다: "%JAR_FILE%"
    echo build/libs에서 사용 가능한 파일:
    dir "%DEMO_DIR%\build\libs\*.jar" /b
    pause
    exit /b 1
)

echo %TIME_NOW% ^> JAR 파일 발견: "%JAR_FILE%" >> "%DEPLOY_LOG%"
echo JAR 파일 발견: "%JAR_FILE%"

:: 애플리케이션 시작
echo %TIME_NOW% ^> Spring Boot 애플리케이션 시작 중... >> "%DEPLOY_LOG%"
echo Spring Boot 애플리케이션 시작 중...
echo 애플리케이션 접속 주소: http://localhost:8080
echo 로그 파일 위치: "%APP_LOG%"
echo.

echo 디버그: 실행할 명령어: java -Xms256m -Xmx512m -jar "%JAR_FILE%"
start /b java -Xms256m -Xmx512m -jar "%JAR_FILE%" > "%APP_LOG%" 2> "%ERROR_LOG%"
echo 디버그: Java 명령어 실행됨

:: 애플리케이션 시작 확인을 위해 대기
timeout /t 10 /nobreak >nul

:: 프로세스 실행 여부 확인
tasklist /fi "imagename eq java.exe" | find /i "java.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo %TIME_NOW% ^> 애플리케이션이 성공적으로 시작되었습니다 >> "%DEPLOY_LOG%"
    echo.
    echo ========================================
    echo 애플리케이션이 성공적으로 시작되었습니다!
    echo ========================================
    echo 접속 주소: http://localhost:8080
    echo 로그 파일: "%APP_LOG%"
    echo.
    echo 브라우저에서 애플리케이션을 열려면 아무 키나 누르세요...
    pause >nul
    start http://localhost:8080
) else (
    echo %TIME_NOW% ^> 오류: 애플리케이션 시작 실패 >> "%DEPLOY_LOG%"
    echo.
    echo ========================================
    echo 오류: 애플리케이션 시작 실패
    echo ========================================
    echo 오류 로그 확인: "%ERROR_LOG%"
    echo 애플리케이션 로그 확인: "%APP_LOG%"
    echo.
    if exist "%ERROR_LOG%" (
        echo 최근 오류:
        type "%ERROR_LOG%"
    )
    pause
    exit /b 1
)

endlocal
