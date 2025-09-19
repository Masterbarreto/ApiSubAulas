# 🧪 Guia de Testes - Sistema de Conclusão por Turma

## 📋 Pré-requisitos para Testar

1. **Servidor rodando**: Certifique-se que a API está ativa
2. **Dados migrados**: Execute a migração se necessário
3. **Ferramenta de teste**: Postman, Insomnia, Thunder Client ou curl

## 🚀 1. Iniciar o Servidor

```bash
# Desenvolvimento
npm run dev

# Ou produção
npm start
```

**Verifique se está rodando**: A API deve estar disponível em `http://localhost:3000`

## 🔄 2. Executar Migração (Se Necessário)

```bash
# Via Postman/Insomnia
POST http://localhost:3000/api/v1/aulas/migrate

# Via curl
curl -X POST http://localhost:3000/api/v1/aulas/migrate
```

**Resposta esperada:**
```json
{
  "message": "Migração executada com sucesso!",
  "migratedCount": 5
}
```

## 🧪 3. Cenários de Teste

### Cenário 1: Criar Aula com Múltiplas Turmas

```bash
# POST /api/v1/aulas
curl -X POST http://localhost:3000/api/v1/aulas \
  -H "Content-Type: application/json" \
  -d '{
    "anoEscolar": "3ano",
    "curso": ["iot"],
    "titulo": "Teste Sistema Conclusão", 
    "Turma": ["1", "2", "3", "4"],
    "Materia": "FTP",
    "DayAula": "2025-09-20",
    "Horario": "14:00",
    "DesAula": "Aula de teste para múltiplas turmas",
    "professor": "Professor Teste"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Aula criada com sucesso!",
  "aulaId": "66f1234567890abcdef12345",
  "cursos": ["iot"],
  "turmas": ["1", "2", "3", "4"]
}
```

**Anote o `aulaId` retornado!**

### Cenário 2: Testar Conclusão por Turma Específica

```bash
# Substitua AULA_ID pelo ID retornado acima
export AULA_ID="66f1234567890abcdef12345"

# Concluir apenas turma 1
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "1"}'
```

**Resposta esperada:**
```json
{
  "message": "Aula concluída para a turma 1!",
  "aula": {
    "turmas": ["1", "2", "3", "4"],
    "turmasConcluidas": ["1"],
    "concluida": false
  }
}
```

### Cenário 3: Concluir Mais Turmas

```bash
# Concluir turma 3
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "3"}'

# Verificar status
curl http://localhost:3000/api/v1/aulas/aula-id/$AULA_ID
```

**Status esperado:**
```json
{
  "turmas": ["1", "2", "3", "4"],
  "turmasConcluidas": ["1", "3"],
  "concluida": false
}
```

### Cenário 4: Testar Correção de Erro

```bash
# 1. Professor "erra" e marca turma 4
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "4"}'

# 2. Percebe o erro e desfaz turma 4
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/desconcluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "4"}'

# 3. Marca a turma correta (2)
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "2"}'
```

**Resultado final esperado:**
```json
{
  "turmas": ["1", "2", "3", "4"],
  "turmasConcluidas": ["1", "3", "2"],
  "concluida": false
}
```

### Cenário 5: Conclusão Total

```bash
# Concluir última turma para completar todas
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "4"}'
```

**Resultado esperado:**
```json
{
  "turmas": ["1", "2", "3", "4"],
  "turmasConcluidas": ["1", "3", "2", "4"],
  "concluida": true
}
```

### Cenário 6: Testar Validações

```bash
# Tentar concluir turma inexistente
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "9"}'
```

**Erro esperado:**
```json
{
  "error": "Turma 9 não está associada a esta aula.",
  "turmasDisponiveis": ["1", "2", "3", "4"]
}
```

```bash
# Tentar concluir turma já concluída
curl -X PATCH http://localhost:3000/api/v1/aulas/$AULA_ID/concluir \
  -H "Content-Type: application/json" \
  -d '{"turma": "1"}'
```

**Erro esperado:**
```json
{
  "error": "Turma 1 já está concluída.",
  "turmasConcluidas": ["1", "3", "2", "4"]
}
```

## 📊 4. Testar Listagens

### Aulas Não Concluídas

```bash
curl http://localhost:3000/api/v1/aulas/MostarAulas
```

**Deve mostrar aulas com:**
- `conclusaoParcial: true` (se algumas turmas concluídas)
- `turmasNaoConcluidas: ["2", "4"]` (turmas pendentes)

### Aulas Concluídas

```bash
curl http://localhost:3000/api/v1/aulas/AulasConcluidas
```

**Deve mostrar apenas aulas onde:**
- `concluida: true`
- `conclusaoCompleta: true`

## 🛠️ 5. Usando Postman/Insomnia

### Collection para Postman

```json
{
  "info": { "name": "Teste Sistema Conclusão" },
  "item": [
    {
      "name": "1. Criar Aula Teste",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/aulas",
        "body": {
          "raw": "{\n  \"anoEscolar\": \"3ano\",\n  \"curso\": [\"iot\"],\n  \"titulo\": \"Teste Sistema\",\n  \"Turma\": [\"1\", \"2\", \"3\", \"4\"],\n  \"Materia\": \"FTP\",\n  \"DayAula\": \"2025-09-20\",\n  \"professor\": \"Teste\"\n}"
        }
      }
    },
    {
      "name": "2. Concluir Turma 1",
      "request": {
        "method": "PATCH", 
        "url": "{{base_url}}/api/v1/aulas/{{aula_id}}/concluir",
        "body": {
          "raw": "{ \"turma\": \"1\" }"
        }
      }
    }
  ]
}
```

### Variáveis no Postman

- `base_url`: `http://localhost:3000`
- `aula_id`: ID retornado na criação

## ✅ 6. Checklist de Validação

- [ ] ✅ Aula criada com arrays de turmas
- [ ] ✅ Conclusão individual por turma funciona
- [ ] ✅ Desconclusão individual funciona
- [ ] ✅ Validação de turma inexistente
- [ ] ✅ Validação de turma já concluída
- [ ] ✅ Status `concluida` atualiza corretamente
- [ ] ✅ Listagens filtram corretamente
- [ ] ✅ Analytics registra eventos
- [ ] ✅ Compatibilidade com dados antigos

## 🐛 7. Troubleshooting

### Servidor não inicia
```bash
# Verificar dependências
npm install

# Verificar variáveis de ambiente
cat .env
```

### Erro de conexão MongoDB
```bash
# Verificar se MongoDB está rodando
# ou se a string de conexão está correta
```

### Erro 404 nas rotas
```bash
# Verificar se as rotas estão registradas
curl http://localhost:3000/api/v1/aulas/
```

### Migração não funciona
```bash
# Verificar logs no console do servidor
# Dados podem já estar migrados
```

## 📈 8. Monitoramento

### Logs do Servidor
- Monitore o console para ver os analytics sendo enviados
- Verifique se não há erros de validação

### Banco de Dados
```javascript
// No MongoDB Compass ou shell, verificar:
db.aulas.findOne({ titulo: "Teste Sistema Conclusão" })

// Deve mostrar:
{
  turmas: ["1", "2", "3", "4"],
  turmasConcluidas: ["1", "3"],
  concluida: false
}
```

Agora você pode testar todo o sistema passo a passo! 🚀