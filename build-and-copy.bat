@echo off
echo Building React frontend...
cd frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Frontend build failed!
    exit /b 1
)

echo Copying frontend build to Spring Boot static resources...
cd ..
if exist "demo\src\main\resources\static" (
    rmdir /s /q "demo\src\main\resources\static"
)
mkdir "demo\src\main\resources\static"
xcopy /e /i /y "frontend\build\*" "demo\src\main\resources\static\"

echo Frontend successfully integrated into Spring Boot!
echo You can now run: gradlew.bat bootRun
