# Script para instalar deps, rodar testes e subir o projeto no GitHub (l7obrabo/jitterbit-order-api)
# Uso: depois de criar o repo em https://github.com/new?name=jitterbit-order-api , execute no PowerShell:
#   .\subir-github.ps1

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/l7obrabo/jitterbit-order-api.git"

Write-Host "1. Instalando dependencias (npm install)..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install falhou" }

Write-Host "2. Rodando testes (npm test)..." -ForegroundColor Cyan
npm test
if ($LASTEXITCODE -ne 0) { throw "npm test falhou" }

Write-Host "3. Inicializando Git e fazendo commit..." -ForegroundColor Cyan
if (-not (Test-Path .git)) { git init }
git add .
git status
git commit -m "feat: API de pedidos com CRUD e PostgreSQL" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "   (nada para commitar ou commit ja feito)" }
git branch -M main

Write-Host "4. Configurando remote e fazendo push..." -ForegroundColor Cyan
$remotes = git remote
if ($remotes -notcontains "origin") {
  git remote add origin $repoUrl
}
git push -u origin main

Write-Host "Concluido. Repo: https://github.com/l7obrabo/jitterbit-order-api" -ForegroundColor Green
