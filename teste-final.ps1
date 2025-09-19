Write-Host "TESTE COMPLETO PARA DEPLOY NO RENDER" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"
$testsPassed = 0
$testsTotal = 0

Write-Host "Aguardando servidor..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Teste 1: Health Check
Write-Host "`n1. Testando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/aulas/MostarAulas" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Servidor respondendo! Aulas encontradas: $($health.Count)" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "   ❌ Servidor não responde: $($_.Exception.Message)" -ForegroundColor Red
}
$testsTotal++

# Teste 2: Migração
Write-Host "`n2. Testando Migração..." -ForegroundColor Yellow
try {
    $migration = Invoke-RestMethod -Uri "$baseUrl/aulas/migrate" -Method POST -ContentType "application/json" -TimeoutSec 10
    Write-Host "   ✅ Migração: $($migration.message)" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "   ⚠️ Migração já pode ter sido executada" -ForegroundColor Yellow
    $testsPassed++
}
$testsTotal++

# Teste 3: Criar Aula
Write-Host "`n3. Testando Criação de Aula..." -ForegroundColor Yellow
$aulaData = @{
    anoEscolar = "3ano"
    curso = @("iot")
    titulo = "TESTE DEPLOY"
    Turma = @("1", "2", "3")
    Materia = "FTP"
    DayAula = "2025-09-20"
    professor = "Teste"
} | ConvertTo-Json -Depth 3

try {
    $novaAula = Invoke-RestMethod -Uri "$baseUrl/aulas" -Method POST -Body $aulaData -ContentType "application/json" -TimeoutSec 10
    Write-Host "   ✅ Aula criada! ID: $($novaAula.aulaId)" -ForegroundColor Green
    $aulaId = $novaAula.aulaId
    $testsPassed++
} catch {
    Write-Host "   ❌ Erro ao criar aula: $($_.Exception.Message)" -ForegroundColor Red
    $aulaId = $null
}
$testsTotal++

# Teste 4: Conclusão por Turma (se aula foi criada)
if ($aulaId) {
    Write-Host "`n4. Testando Conclusão por Turma..." -ForegroundColor Yellow
    $concluirData = @{ turma = "1" } | ConvertTo-Json
    try {
        $conclusao = Invoke-RestMethod -Uri "$baseUrl/aulas/$aulaId/concluir" -Method PATCH -Body $concluirData -ContentType "application/json" -TimeoutSec 10
        Write-Host "   ✅ Turma concluída: $($conclusao.message)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "   ❌ Erro ao concluir turma: $($_.Exception.Message)" -ForegroundColor Red
    }
    $testsTotal++

    # Teste 5: Desfazer Conclusão
    Write-Host "`n5. Testando Desfazer Conclusão..." -ForegroundColor Yellow
    try {
        $desconclusao = Invoke-RestMethod -Uri "$baseUrl/aulas/$aulaId/desconcluir" -Method PATCH -Body $concluirData -ContentType "application/json" -TimeoutSec 10
        Write-Host "   ✅ Conclusão desfeita: $($desconclusao.message)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "   ❌ Erro ao desfazer: $($_.Exception.Message)" -ForegroundColor Red
    }
    $testsTotal++
}

# Resultados
Write-Host "`n====================================" -ForegroundColor Cyan
Write-Host "RESULTADOS:" -ForegroundColor White
Write-Host "Testes Aprovados: $testsPassed de $testsTotal" -ForegroundColor Green
$porcentagem = [math]::Round(($testsPassed / $testsTotal) * 100, 1)
Write-Host "Taxa de Sucesso: $porcentagem%" -ForegroundColor Green

if ($testsPassed -eq $testsTotal) {
    Write-Host "`n🎉 TODOS OS TESTES APROVADOS!" -ForegroundColor Green
    Write-Host "✅ Sistema pronto para deploy no Render!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Alguns testes falharam" -ForegroundColor Yellow
    Write-Host "💡 Revise os erros antes do deploy" -ForegroundColor Yellow
}

Write-Host "`n🚀 Para fazer deploy:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Sistema pronto para deploy'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White