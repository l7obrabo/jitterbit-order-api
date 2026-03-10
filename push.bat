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
git commit -m "refactor: usa Sequelize (ORM) e atualiza README"
git push -u origin main

if errorlevel 1 (
  echo.
  echo Se o commit falhou: confira se ha alteracoes. Se o push falhou: confira login no GitHub.
  pause
)
