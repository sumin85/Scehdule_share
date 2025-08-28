@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Starting Spring Boot Application
echo ========================================

:: Set project paths
set PROJECT_ROOT=%~dp0
set DEMO_DIR=%PROJECT_ROOT%demo
set FRONTEND_DIR=%PROJECT_ROOT%frontend

:: Create logs directory
if not exist "%PROJECT_ROOT%logs" mkdir "%PROJECT_ROOT%logs"

:: Log file paths
set APP_LOG=%PROJECT_ROOT%logs\app.log
set ERROR_LOG=%PROJECT_ROOT%logs\error.log
set DEPLOY_LOG=%PROJECT_ROOT%logs\deploy.log

:: Get current timestamp (improved compatibility)
for /f "tokens=1-4 delims=/ " %%i in ('date /t') do set mydate=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ('time /t') do set mytime=%%i:%%j
set "TIME_NOW=%mydate% %mytime%"

echo %TIME_NOW% ^> Starting deployment process... >> "%DEPLOY_LOG%"

:: Check if Node.js is installed (for frontend build)
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> ERROR: Node.js is not installed or not in PATH >> "%DEPLOY_LOG%"
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> ERROR: npm is not available >> "%DEPLOY_LOG%"
    echo ERROR: npm is not available
    pause
    exit /b 1
)

:: Check if Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> ERROR: Java is not installed or not in PATH >> "%DEPLOY_LOG%"
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

:: Kill existing Spring Boot processes more specifically
echo %TIME_NOW% ^> Stopping existing Spring Boot processes... >> "%DEPLOY_LOG%"
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq java.exe" /fo csv ^| findstr "demo"') do (
    taskkill /f /pid %%i >nul 2>&1
)

:: Wait a moment
timeout /t 3 /nobreak >nul

:: Build frontend first
echo %TIME_NOW% ^> Building frontend... >> "%DEPLOY_LOG%"
echo Building React frontend...
if exist "%FRONTEND_DIR%" (
    cd /d "%FRONTEND_DIR%"
    call npm run build
    if !ERRORLEVEL! neq 0 (
        echo %TIME_NOW% ^> ERROR: Frontend build failed >> "%DEPLOY_LOG%"
        echo Frontend build failed!
        pause
        exit /b 1
    )
    
    :: Copy frontend build to Spring Boot static resources
    echo %TIME_NOW% ^> Copying frontend to Spring Boot... >> "%DEPLOY_LOG%"
    cd /d "%PROJECT_ROOT%"
    if exist "%DEMO_DIR%\src\main\resources\static" (
        rmdir /s /q "%DEMO_DIR%\src\main\resources\static"
    )
    mkdir "%DEMO_DIR%\src\main\resources\static"
    xcopy /e /i /y "%FRONTEND_DIR%\build\*" "%DEMO_DIR%\src\main\resources\static\" >nul
)

:: Build Spring Boot application
echo %TIME_NOW% ^> Building Spring Boot application... >> "%DEPLOY_LOG%"
echo Building Spring Boot application...
cd /d "%DEMO_DIR%"
call gradlew.bat build -x test
if %ERRORLEVEL% neq 0 (
    echo %TIME_NOW% ^> ERROR: Spring Boot build failed >> "%DEPLOY_LOG%"
    echo Spring Boot build failed!
    pause
    exit /b 1
)

:: Find the JAR file
echo %TIME_NOW% ^> Looking for JAR file... >> "%DEPLOY_LOG%"
set JAR_FILE=
for /r "%DEMO_DIR%\build\libs" %%f in (*.jar) do (
    echo %%~nxf | findstr /v "plain" >nul
    if !ERRORLEVEL! equ 0 (
        set JAR_FILE=%%f
        goto :found_jar
    )
)

:found_jar
if "%JAR_FILE%"=="" (
    echo %TIME_NOW% ^> ERROR: JAR file not found >> "%DEPLOY_LOG%"
    echo ERROR: JAR file not found in build/libs directory
    pause
    exit /b 1
)

echo %TIME_NOW% ^> Found JAR file: %JAR_FILE% >> "%DEPLOY_LOG%"
echo Found JAR file: %JAR_FILE%

:: Start the application
echo %TIME_NOW% ^> Starting Spring Boot application... >> "%DEPLOY_LOG%"
echo Starting Spring Boot application...
echo Application will be available at: http://localhost:8080
echo Logs are being written to: %APP_LOG%
echo.

start /b java -Xms256m -Xmx512m -jar "%JAR_FILE%" > "%APP_LOG%" 2> "%ERROR_LOG%"

:: Wait and check if application started
timeout /t 10 /nobreak >nul

:: Check if process is running
tasklist /fi "imagename eq java.exe" | find /i "java.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo %TIME_NOW% ^> Application started successfully >> "%DEPLOY_LOG%"
    echo.
    echo ========================================
    echo Application started successfully!
    echo ========================================
    echo URL: http://localhost:8080
    echo Logs: %APP_LOG%
    echo.
    echo Press any key to open the application in browser...
    pause >nul
    start http://localhost:8080
) else (
    echo %TIME_NOW% ^> ERROR: Application failed to start >> "%DEPLOY_LOG%"
    echo.
    echo ========================================
    echo ERROR: Application failed to start
    echo ========================================
    echo Check the error log: %ERROR_LOG%
    echo Check the application log: %APP_LOG%
    echo.
    if exist "%ERROR_LOG%" (
        echo Recent errors:
        type "%ERROR_LOG%"
    )
    pause
    exit /b 1
)

endlocal
