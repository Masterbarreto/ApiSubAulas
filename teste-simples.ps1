# Teste Simples do Sistema
Write-Host "🧪 Teste Simples - Sistema de Conclusão por Turma" -ForegroundColor Green

$baseUrl = "http://localhost:3000/api/v1"

# Testar se o servidor está rodando
try {
    $test = Invoke-RestMethod -Uri "$baseUrl/aulas/MostarAulas" -Method GET
    Write-Host "✅ Servidor está rodando!" -ForegroundColor Green
    Write-Host "📊 Aulas encontradas: $($test.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Servidor não está respondendo: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Executar migração
try {
    $migration = Invoke-RestMethod -Uri "$baseUrl/aulas/migrate" -Method POST -ContentType "application/json"
    Write-Host "✅ Migração: $($migration.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Migração pode já ter sido executada" -ForegroundColor Yellow
}

Write-Host "`n🎯 Use o Thunder Client para testes detalhados!" -ForegroundColor Cyan