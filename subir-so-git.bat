@echo off
chcp 65001 >nul
rem So usa Git - sem npm. Use se o Node nao estiver instalado.
if exist "C:\Program Files\Git\cmd\git.exe" set "PATH=C:\Program Files\Git\cmd;%PATH%"
if exist "C:\Program Files\Git\bin\git.exe" set "PATH=C:\Program Files\Git\bin;%PATH%"

echo Git: init, add, commit...
if not exist .git git init
rem Define nome e email so neste repo (para o commit funcionar)
git config user.email "l7obrabo@users.noreply.github.com"
git config user.name "l7obrabo"
git add .
git commit -m "feat: API de pedidos com CRUD e PostgreSQL"
git branch -M main

echo.
echo Configurando remote e push...
git remote remove origin 2>nul
git remote add origin https://github.com/l7obrabo/jitterbit-order-api.git
git push -u origin main

if errorlevel 1 (
  echo.
  echo Push falhou. Confira: 1) Git instalado  2) Logado no GitHub
  pause
  exit /b 1
)
echo.
echo Concluido: https://github.com/l7obrabo/jitterbit-order-api
pause
