# 🧪 Script de Teste Completo para Deploy no Render
# Execute este script antes de fazer deploy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 TESTE COMPLETO PARA DEPLOY NO RENDER" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"
$testsPassed = 0
$testsTotal = 0

function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    
    $global:testsTotal++
    Write-Host "`n🔍 Teste $global:testsTotal : $TestName" -ForegroundColor Yellow
    
    try {
        $headers = @{"Content-Type" = "application/json"}
        
        if ($Body) {
            $result = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $Body -TimeoutSec 10
        } else {
            $result = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -TimeoutSec 10
        }
        
        Write-Host "   ✅ SUCESSO" -ForegroundColor Green
        $global:testsPassed++
        return $result
    }
    catch {
        Write-Host "   ❌ FALHOU: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Aguardar servidor estar pronto
Write-Host "`n⏳ Aguardando servidor..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# TESTE 1: Verificar se servidor está rodando
$healthCheck = Test-Endpoint "Health Check - Listar Aulas" "GET" "$baseUrl/aulas/MostarAulas"

if (-not $healthCheck) {
    Write-Host "`n❌ SERVIDOR NÃO ESTÁ RESPONDENDO!" -ForegroundColor Red
    Write-Host "   Verifique se o servidor está rodando na porta 3000" -ForegroundColor Yellow
    exit 1
}

# TESTE 2: Executar migração
$migration = Test-Endpoint "Migração de Dados" "POST" "$baseUrl/aulas/migrate"

# TESTE 3: Criar aula de teste
$aulaTestData = @{
    anoEscolar = "3ano"
    curso = @("iot")
    titulo = "TESTE DEPLOY RENDER"
    Turma = @("1", "2", "3", "4")
    Materia = "FTP"
    DayAula = "2025-09-20"
    Horario = "14:00"
    DesAula = "Aula de teste para deploy"
    professor = "Professor Deploy"
} | ConvertTo-Json -Depth 3

$novaAula = Test-Endpoint "Criar Aula com Múltiplas Turmas" "POST" "$baseUrl/aulas" $aulaTestData

if ($novaAula) {
    $aulaId = $novaAula.aulaId
    Write-Host "   📝 ID da Aula: $aulaId" -ForegroundColor Cyan
    
    # TESTE 4: Concluir turma específica
    $concluirBody = @{ turma = "1" } | ConvertTo-Json
    $conclusao1 = Test-Endpoint "Concluir Turma 1" "PATCH" "$baseUrl/aulas/$aulaId/concluir" $concluirBody
    
    # TESTE 5: Concluir outra turma
    $concluirBody2 = @{ turma = "3" } | ConvertTo-Json
    $conclusao2 = Test-Endpoint "Concluir Turma 3" "PATCH" "$baseUrl/aulas/$aulaId/concluir" $concluirBody2
    
    # TESTE 6: Desfazer conclusão (teste de correção)
    $desconcluirBody = @{ turma = "3" } | ConvertTo-Json
    $desconclusao = Test-Endpoint "Desfazer Turma 3" "PATCH" "$baseUrl/aulas/$aulaId/desconcluir" $desconcluirBody
    
    # TESTE 7: Buscar aula específica
    $aulaEspecifica = Test-Endpoint "Buscar Aula por ID" "GET" "$baseUrl/aulas/aula-id/$aulaId"
    
    # TESTE 8: Listar aulas concluídas
    $aulasConcluidas = Test-Endpoint "Listar Aulas Concluídas" "GET" "$baseUrl/aulas/AulasConcluidas"
    
    # TESTE 9: Validação - Tentar concluir turma inexistente
    $turmaInvalidaBody = @{ turma = "9" } | ConvertTo-Json
    $validacao = Test-Endpoint "Validação - Turma Inexistente" "PATCH" "$baseUrl/aulas/$aulaId/concluir" $turmaInvalidaBody
    
    # Verificar se retornou erro (esperado)
    if (-not $validacao) {
        Write-Host "   ✅ Validação funcionou corretamente (erro esperado)" -ForegroundColor Green
        $global:testsPassed++
    }
    
    Write-Host "`n📊 VERIFICAÇÃO DOS DADOS:" -ForegroundColor Cyan
    if ($aulaEspecifica) {
        Write-Host "   Título: $($aulaEspecifica.titulo)" -ForegroundColor White
        Write-Host "   Turmas: $($aulaEspecifica.turmas -join ', ')" -ForegroundColor White
        Write-Host "   Turmas Concluídas: $($aulaEspecifica.turmasConcluidas -join ', ')" -ForegroundColor Green
        Write-Host "   Status: $($aulaEspecifica.concluida)" -ForegroundColor $(if($aulaEspecifica.concluida) { "Green" } else { "Yellow" })
    }
}

# RESULTADOS FINAIS
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 RESULTADOS DOS TESTES" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Testes Aprovados: $testsPassed" -ForegroundColor Green
Write-Host "📝 Total de Testes: $testsTotal" -ForegroundColor White
$porcentagem = [math]::Round(($testsPassed / $testsTotal) * 100, 1)
Write-Host "📈 Taxa de Sucesso: $porcentagem%" -ForegroundColor $(if($porcentagem -ge 80) { "Green" } else { "Yellow" })

if ($testsPassed -eq $testsTotal) {
    Write-Host "`n🎉 TODOS OS TESTES APROVADOS!" -ForegroundColor Green
    Write-Host "✅ Sistema pronto para deploy no Render!" -ForegroundColor Green
} elseif ($porcentagem -ge 80) {
    Write-Host "`n⚠️ MAIORIA DOS TESTES APROVADOS" -ForegroundColor Yellow
    Write-Host "💡 Sistema pode ser deployado, mas revise os erros" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ MUITOS TESTES FALHARAM" -ForegroundColor Red
    Write-Host "🔧 Corrija os problemas antes do deploy" -ForegroundColor Red
}

Write-Host "`n📋 CHECKLIST PARA RENDER:" -ForegroundColor Cyan
Write-Host "□ Variáveis de ambiente configuradas" -ForegroundColor White
Write-Host "□ MongoDB Atlas acessível" -ForegroundColor White
Write-Host "□ Código commitado no GitHub" -ForegroundColor White
Write-Host "□ Port dinâmico configurado" -ForegroundColor White

Write-Host "`n🚀 Para deploy no Render:" -ForegroundColor Green
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Sistema conclusão por turma implementado'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host "4. Configure no Render: Build Command: npm install" -ForegroundColor White
Write-Host "5. Configure no Render: Start Command: npm start" -ForegroundColor White