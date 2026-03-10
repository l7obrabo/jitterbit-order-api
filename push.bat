@echo off
chcp 65001 >nul
if exist "C:\Program Files\Git\cmd\git.exe" set "PATH=C:\Program Files\Git\cmd;%PATH%"
if exist "C:\Program Files\Git\bin\git.exe" set "PATH=C:\Program Files\Git\bin;%PATH%"

if not exist .git (
  git init
  git config user.email "l7obrabo@users.noreply.github.com"
  git config user.name "l7obrabo"
  git branch -M main
  git remote add origin https://github.com/l7obrabo/jitterbit-order-api.git
)

git add .
git status
git commit -m "fix: CI testes (workflow, engines, gitattributes)" || echo Nada para commitar.
git push -u origin main

if errorlevel 1 (
  echo.
  echo Push falhou - confira se esta logado no GitHub.
  pause
)
