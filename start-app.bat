@echo off
echo ========================================
echo   Lines Genius - Quick Start
echo ========================================
echo.

echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Lines Genius...
echo.
echo The app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:5173
npm run dev
