@echo off

REM ================================ 
REM Run Backend Unit Tests 
REM ================================ 
echo Running backend tests... 
cd backend 
call venv\Scripts\activate 
python manage.py test 
IF %ERRORLEVEL% NEQ 0 ( 
    echo Backend tests failed. Exiting. 
    pause 
    exit /b 1 ) 
    call venv\Scripts\deactivate 
    cd ..

REM ================================ 
REM Run Frontend Unit Tests 
REM ================================ 
echo Running frontend tests... 
cd frontend 
call npm run test 
IF %ERRORLEVEL% NEQ 0 ( 
    echo Frontend tests failed. Exiting.
     pause 
     exit /b 1 ) 
     cd ..

REM ================================ 
REM Start the Servers if Tests Passed 
REM ================================ 
echo Starting Backend Server... 
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && daphne -b 127.0.0.1 -p 8000 core.asgi:application"

echo Starting Frontend Server... 
start "Frontend Server" cmd /k "cd frontend && npm run dev"