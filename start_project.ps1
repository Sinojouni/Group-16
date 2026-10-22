# Movie Recommendation System - One-Click Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Movie Recommendation System - Launching Services" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = $PSScriptRoot

# 1. Model Service (FastAPI on Port 8001)
Write-Host "`n[1/3] Starting Model Service (FastAPI) on http://127.0.0.1:8001..." -ForegroundColor Yellow
$modelProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR\model_service'; python -m uvicorn main:app --host 127.0.0.1 --port 8001" -PassThru

# 2. Backend Service (Django REST Framework on Port 8000)
Write-Host "`n[2/3] Starting Django Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR\backend'; python manage.py runserver 127.0.0.1:8000" -PassThru

# 3. Frontend Service (Vite + React on Port 5173)
Write-Host "`n[3/3] Starting Frontend (React + Vite) on http://localhost:5173..." -ForegroundColor Yellow
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR\frontend'; npx vite --host 0.0.0.0 --port 5173" -PassThru

Write-Host "`nAll services have been started in separate windows!" -ForegroundColor Green
Write-Host "Frontend:      http://localhost:5173" -ForegroundColor White
Write-Host "Backend API:   http://localhost:8000" -ForegroundColor White
Write-Host "Swagger Docs:  http://localhost:8000/api/schema/swagger-ui/" -ForegroundColor White
Write-Host "Model Service: http://127.0.0.1:8001/health" -ForegroundColor White
