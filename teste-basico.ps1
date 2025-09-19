Write-Host "Teste Sistema de Conclusao por Turma" -ForegroundColor Green

$baseUrl = "http://localhost:3000/api/v1"

try {
    $test = Invoke-RestMethod -Uri "$baseUrl/aulas/MostarAulas" -Method GET
    Write-Host "Servidor funcionando! Aulas encontradas: $($test.Count)" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $migration = Invoke-RestMethod -Uri "$baseUrl/aulas/migrate" -Method POST -ContentType "application/json"
    Write-Host "Migracao executada: $($migration.message)" -ForegroundColor Green
} catch {
    Write-Host "Migracao pode ja ter sido executada" -ForegroundColor Yellow
}