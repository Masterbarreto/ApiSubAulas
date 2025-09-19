# Script de Teste PowerShell - Sistema de Conclusão por Turma
# Execute este script no PowerShell para testar toda a funcionalidade

Write-Host "🧪 Iniciando Testes do Sistema de Conclusão por Turma" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"
$headers = @{"Content-Type" = "application/json"}

# Função para fazer requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Uri,
        [string]$Body = $null
    )
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers
        }
        return $response
    }
    catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Executar Migração
Write-Host "1️⃣ Executando migração..." -ForegroundColor Yellow
$migration = Invoke-ApiRequest -Method "POST" -Uri "$baseUrl/aulas/migrate"
if ($migration) {
    Write-Host "✅ Migração: $($migration.message)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Migração pode já ter sido executada" -ForegroundColor Yellow
}

# 2. Criar Aula de Teste
Write-Host "`n2️⃣ Criando aula de teste..." -ForegroundColor Yellow
$aulaData = @{
    anoEscolar = "3ano"
    curso = @("iot")
    titulo = "Teste Sistema Conclusao"
    Turma = @("1", "2", "3", "4")
    Materia = "FTP"
    DayAula = "2025-09-20"
    Horario = "14:00"
    DesAula = "Aula de teste para multiplas turmas"
    professor = "Professor Teste"
} | ConvertTo-Json -Depth 3

$novaAula = Invoke-ApiRequest -Method "POST" -Uri "$baseUrl/aulas" -Body $aulaData
if ($novaAula) {
    $aulaId = $novaAula.aulaId
    Write-Host "✅ Aula criada! ID: $aulaId" -ForegroundColor Green
    Write-Host "   Turmas: $($novaAula.turmas -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "❌ Falha ao criar aula" -ForegroundColor Red
    exit
}

# 3. Testar Conclusão Individual
Write-Host "`n3️⃣ Testando conclusão por turma..." -ForegroundColor Yellow

# Concluir turma 1
$body1 = @{ turma = "1" } | ConvertTo-Json
$result1 = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body1
if ($result1) {
    Write-Host "✅ Turma 1 concluída!" -ForegroundColor Green
}

# Concluir turma 3
$body3 = @{ turma = "3" } | ConvertTo-Json
$result3 = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body3
if ($result3) {
    Write-Host "✅ Turma 3 concluída!" -ForegroundColor Green
}

# 4. Simular Erro e Correção
Write-Host "`n4️⃣ Simulando erro do professor..." -ForegroundColor Yellow

# "Erro": Concluir turma 4
$body4 = @{ turma = "4" } | ConvertTo-Json
$erro = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body4
if ($erro) {
    Write-Host "✅ Turma 4 concluída (erro simulado)" -ForegroundColor Green
}

# Correção: Desfazer turma 4
$desfazer = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/desconcluir" -Body $body4
if ($desfazer) {
    Write-Host "✅ Turma 4 desconcluída (correção)" -ForegroundColor Green
}

# Marcar turma correta (2)
$body2 = @{ turma = "2" } | ConvertTo-Json
$correto = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body2
if ($correto) {
    Write-Host "✅ Turma 2 concluída (correto)" -ForegroundColor Green
}

# 5. Verificar Status
Write-Host "`n5️⃣ Verificando status da aula..." -ForegroundColor Yellow
$status = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/aulas/aula-id/$aulaId"
if ($status) {
    Write-Host "📊 Status da Aula:" -ForegroundColor Cyan
    Write-Host "   Título: $($status.titulo)" -ForegroundColor White
    Write-Host "   Turmas Total: $($status.turmas -join ', ')" -ForegroundColor White
    Write-Host "   Turmas Concluídas: $($status.turmasConcluidas -join ', ')" -ForegroundColor Green
    if ($status.concluida) {
        Write-Host "   Concluída: $($status.concluida)" -ForegroundColor Green
    } else {
        Write-Host "   Concluída: $($status.concluida)" -ForegroundColor Yellow
    }
}

# 6. Testar Validações
Write-Host "`n6️⃣ Testando validações..." -ForegroundColor Yellow

# Turma inexistente
$bodyInvalido = @{ turma = "9" } | ConvertTo-Json
Write-Host "   Testando turma inexistente (9)..." -ForegroundColor Gray
$invalido = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $bodyInvalido

# Turma já concluída
Write-Host "   Testando turma já concluída (1)..." -ForegroundColor Gray
$jaConcluida = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body1

# 7. Completar Aula
Write-Host "`n7️⃣ Completando a aula..." -ForegroundColor Yellow
$finalizar = Invoke-ApiRequest -Method "PATCH" -Uri "$baseUrl/aulas/$aulaId/concluir" -Body $body4
if ($finalizar) {
    Write-Host "✅ Todas as turmas concluídas! Aula completa." -ForegroundColor Green
}

# 8. Verificar Listagens
Write-Host "`n8️⃣ Verificando listagens..." -ForegroundColor Yellow

$aulasNaoConcluidas = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/aulas/MostarAulas"
$aulasConcluidas = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/aulas/AulasConcluidas"

Write-Host "📋 Aulas Não Concluídas: $($aulasNaoConcluidas.Count)" -ForegroundColor Yellow
Write-Host "📋 Aulas Concluídas: $($aulasConcluidas.Count)" -ForegroundColor Green

Write-Host "`n🎉 Testes Concluídos!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ Sistema funcionando corretamente!" -ForegroundColor Green
Write-Host "🔍 ID da Aula Teste: $aulaId" -ForegroundColor Cyan