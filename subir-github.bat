@echo off
chcp 65001 >nul
rem Inclui Node.js e Git no PATH se estiverem nos locais padrao do Windows
if exist "C:\Program Files\nodejs\npm.cmd" set "PATH=C:\Program Files\nodejs;%PATH%"
if exist "C:\Program Files (x86)\nodejs\npm.cmd" set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
if exist "C:\Program Files\Git\cmd\git.exe" set "PATH=C:\Program Files\Git\cmd;%PATH%"
if exist "C:\Program Files\Git\bin\git.exe" set "PATH=C:\Program Files\Git\bin;%PATH%"

echo 1. Instalando dependencias (npm install)...
call npm install
if errorlevel 1 ( echo npm install falhou. Instale o Node.js e tente de novo. & pause & exit /b 1 )

echo.
echo 2. Rodando testes (npm test)...
call npm test
if errorlevel 1 ( echo npm test falhou. & pause & exit /b 1 )

echo.
echo 3. Git: init, add, commit...
if not exist .git git init
call git add .
call git commit -m "feat: API de pedidos com CRUD e PostgreSQL"
rem Se ja tiver commit, continua mesmo assim
call git branch -M main

echo.
echo 4. Configurando remote e push...
call git remote remove origin 2>nul
call git remote add origin https://github.com/l7obrabo/jitterbit-order-api.git
call git push -u origin main

if errorlevel 1 ( echo. Push falhou - confira se esta logado no GitHub. & pause & exit /b 1 )
echo.
echo Concluido. Repo: https://github.com/l7obrabo/jitterbit-order-api
pause
