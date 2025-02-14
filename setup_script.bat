@echo off
setlocal

echo ============================================
echo Setting up the BACKEND
echo ============================================

REM Change to the backend folder
cd backend

REM Check if Python is installed
where python >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.
    pause
) else (
    echo Python found.
)

REM Check if virtual environment folder "venv" exists; if not, create it.
if not exist "venv" (
    echo Virtual environment not found. Creating venv...
    python -m venv venv
    if errorlevel 1 (
        echo Failed to create virtual environment.
        pause
    )
) else (
    echo Virtual environment exists.
)

REM Activate the virtual environment
call venv\Scripts\activate

REM Install backend dependencies from requirements.txt if exists
if exist requirements.txt (
    echo Installing backend dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Failed to install backend dependencies.
        pause
    )
) else (
    echo requirements.txt not found.
)
pip install channels["daphne"]
REM Deactivate virtual environment
call venv\Scripts\deactivate

echo Backend setup complete.

echo.
echo ============================================
echo Setting up the FRONTEND
echo ============================================

REM Change to the frontend folder
cd ..\frontend

echo Installing frontend dependencies...
npm install --force
if errorlevel 1 (
    echo npm install failed.
    pause
)

echo Frontend setup complete.

echo.
echo ============================================
echo Running run_script.bat
echo ============================================
if exist run_script.bat (
    call run_script.bat
) else (
    echo run_script.bat not found.
)

endlocal
pause
