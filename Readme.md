# 📚 API Mongo - Sistema de Substituição de Aulas

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Uma API REST robusta para gerenciamento inteligente de substituições de aulas**

[🚀 Começar](#instalação) •
[📖 Documentação](#documentação) •
[🛠️ API](#endpoints) •
[🤝 Contribuir](#contribuição)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Sistema de Substituição de Aulas** é uma API REST desenvolvida para facilitar o gerenciamento de substituições de aulas em instituições educacionais. A aplicação oferece controle completo sobre usuários, aulas, relatórios e atividades, com recursos avançados de analytics e monitoramento.

### 🎨 Características Principais

- 🔐 **Autenticação segura** com criptografia bcrypt
- 📊 **Relatórios detalhados** com gráficos e estatísticas
- 🎯 **Rastreamento de eventos** via Segment Analytics
- 📧 **Sistema de notificações** por e-mail
- 📱 **API RESTful** bem documentada
- 🔄 **Recuperação de senha** automatizada

## ⚡ Funcionalidades

### 👥 Gerenciamento de Usuários
- [x] Cadastro e autenticação de usuários
- [x] Sistema de login/logout seguro
- [x] Recuperação e redefinição de senhas
- [x] Verificação de conta por código
- [x] Registro de atividades do usuário

### 🎓 Gerenciamento de Aulas
- [x] Criação, edição e exclusão de aulas
- [x] **Sistema de conclusão granular** - Controle por turma específica
- [x] **Correção de erros facilitada** - Desfazer conclusão por turma individual
- [x] **Suporte a múltiplas turmas** - Uma aula para várias turmas simultaneamente
- [x] **Upload de arquivos** e links para materiais didáticos
- [x] Listagem de aulas por status (pendente/concluída/parcial)
- [x] Histórico completo de modificações

### 🎯 Sistema de Conclusão por Turma
- [x] **Conclusão específica** - Marcar apenas turmas individuais como concluídas
- [x] **Conclusão parcial** - Acompanhar progresso por turma
- [x] **Correção de erros** - Desfazer conclusão de turma específica
- [x] **Validações inteligentes** - Previne erros de marcação
- [x] **Analytics detalhado** - Rastreamento granular por turma

### 📈 Relatórios e Analytics
- [x] Relatórios semanais automatizados
- [x] Estatísticas de aulas por mês
- [x] Ranking de matérias mais substituídas
- [x] Dashboard com métricas em tempo real

## � Documentação Avançada

### 🎯 Sistema de Conclusão por Turma Específica

#### Como Funciona

O sistema permite controle granular de conclusão de aulas por turma individual, resolvendo o problema de quando um professor marca a turma errada e precisa corrigir apenas aquela turma específica.

#### Nova Estrutura de Dados

```javascript
// Exemplo de aula com conclusão por turma
{
  _id: ObjectId("..."),
  titulo: "Banco de Dados",
  cursos: ["iot"],
  turmas: ["1", "2", "3", "4"],
  turmasConcluidas: ["1", "3"], // Apenas turmas 1 e 3 concluídas
  concluida: false, // false porque nem todas as turmas estão concluídas
  professor: "João Silva"
}
```

#### APIs de Conclusão

**1. Concluir Aula para Turma Específica**
```javascript
PATCH /api/v1/aulas/:aulaId/concluir
{
  "turma": "4"
}
```

**2. Desfazer Conclusão para Turma Específica**
```javascript
PATCH /api/v1/aulas/:aulaId/desconcluir
{
  "turma": "4"
}
```

**3. Cenário Prático: Corrigir Erro**
```javascript
// 1. Professor conclui para turma errada
PATCH /concluir { "turma": "4" }

// 2. Percebe o erro e desfaz
PATCH /desconcluir { "turma": "4" }

// 3. Conclui para a turma correta
PATCH /concluir { "turma": "2" }
```

#### Benefícios

- ✅ **Precisão total**: Cada turma tem status individual
- ✅ **Correção fácil**: Remove/adiciona turmas específicas
- ✅ **Compatibilidade**: Funciona com dados antigos
- ✅ **Flexibilidade**: Conclusão gradual ou total
- ✅ **Analytics detalhado**: Rastreia cada ação por turma

## �🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### Segurança & Validação
- **Bcrypt** - Criptografia de senhas
- **Yup** - Validação de schemas
- **Express-session** - Gerenciamento de sessões

### Utilitários
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos
- **Morgan** - Logging de requisições
- **Swagger** - Documentação da API
- **Segment** - Analytics e tracking

### DevOps
- **dotenv** - Gerenciamento de variáveis de ambiente
- **Chalk** - Colorização de logs
- **Nodemon** - Auto-reload em desenvolvimento

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14+ recomendada)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Masterbarreto/api-mongo.git
cd api-mongo
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
MONGODB_URI=mongodb://localhost:27017/sistema-aulas
DB_NAME=sistema_substituicao_aulas

# Configurações do Servidor
PORT=3000
API_VERSION=/api/v1
NODE_ENV=development

# Configurações de Sessão
SESSION_SECRET=sua-chave-secreta-super-segura

# Configurações de Email (Gmail)
GMAIL_USER=seu-email@gmail.com
GMAIL_PASS=sua-senha-de-app

# Analytics
SEGMENT_WRITE_KEY=sua-chave-do-segment

# URLs
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:3000/api/v1
```

## 🎯 Uso

### Desenvolvimento
```bash
# Instalar nodemon globalmente (opcional)
npm install -g nodemon

# Executar em modo desenvolvimento
nodemon api/server/serves.js
```

### Produção
```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

## 🛣️ Endpoints

### 🔐 Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/users/register` | Cadastro de usuário |
| `POST` | `/api/v1/users/login` | Login do usuário |
| `DELETE` | `/api/v1/users/logout/:id` | Logout do usuário |
| `POST` | `/api/v1/users/reset-password` | Redefinir senha |

### 🎓 Aulas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/aulas` | Criar nova aula |
| `GET` | `/api/v1/aulas/MostarAulas` | Listar aulas pendentes |
| `GET` | `/api/v1/aulas/AulasConcluidas` | Listar aulas concluídas |
| `PATCH` | `/api/v1/aulas/:id` | Editar aula |
| `DELETE` | `/api/v1/aulas/:id` | Excluir aula |
| `PATCH` | `/api/v1/aulas/:id/concluir` | Concluir aula |
| `PATCH` | `/api/v1/aulas/:id/desconcluir` | Desfazer conclusão |

### 📊 Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/relatorios/relatorio-semanal` | Relatório semanal |
| `GET` | `/api/v1/relatorios/materias-mais-substituicoes` | Top matérias |
| `GET` | `/api/v1/relatorios/total-aulas-concluidas` | Total concluídas |
| `GET` | `/api/v1/relatorios/aulas-por-mes` | Aulas por mês |

### 📝 Atividades
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/users/activity` | Registrar atividade |
| `GET` | `/api/v1/users/activity/:userId` | Buscar atividades |

## 📁 Estrutura do Projeto

```
api-mongo/
├── 📁 api/
│   ├── 📁 controllers/      # Lógica de negócio
│   │   ├── userController.js
│   │   ├── aulaController.js
│   │   └── relatorioController.js
│   ├── 📁 models/          # Modelos do MongoDB
│   │   ├── User.js
│   │   ├── Aula.js
│   │   └── Activity.js
│   ├── 📁 routes/          # Definição das rotas
│   │   ├── userRoutes.js
│   │   ├── aulaRoutes.js
│   │   └── relatorioRoutes.js
│   ├── 📁 public/          # Arquivos estáticos
│   │   └── 📁 html/       # Páginas de feedback
│   ├── 📁 server/          # Configuração do servidor
│   │   └── serves.js      # Arquivo principal
│   └── 📁 utils/           # Utilitários
│       ├── emailService.js
│       ├── segmentService.js
│       └── validators.js
├── 📄 .env.example         # Exemplo de variáveis
├── 📄 package.json         # Dependências
└── 📄 README.md           # Este arquivo
```

## 📖 Documentação

### Swagger UI
Acesse a documentação interativa da API em:
```
http://localhost:3000/docs
```

### Exemplo de Requisição

#### Criar uma nova aula
```javascript
// POST /api/v1/aulas
{
  "materia": "Matemática",
  "professor": "João Silva",
  "dataAula": "2024-06-20",
  "horario": "14:00",
  "substituido": false,
  "observacoes": "Aula sobre equações de segundo grau"
}
```

#### Resposta
```javascript
{
  "success": true,
  "message": "Aula criada com sucesso",
  "data": {
    "_id": "60d5ec49f1b2c8b1f4c8a1b2",
    "materia": "Matemática",
    "professor": "João Silva",
    "dataAula": "2024-06-20T00:00:00.000Z",
    "horario": "14:00",
    "concluida": false,
    "createdAt": "2024-06-17T10:30:00.000Z"
  }
}
```

## 🧪 Testes

```bash
# Executar todos os testes (quando implementados)
npm test

# Para implementar testes, considere usar:
# - Jest para testes unitários
# - Supertest para testes de integração
# - MongoDB Memory Server para testes com banco
```

## 🚀 Deploy

### Render
```bash
# 1. Conecte seu repositório GitHub ao Render
# 2. Configure as variáveis de ambiente no painel do Render:

# Configurações obrigatórias:
MONGODB_URI=sua-uri-mongodb-atlas
DB_NAME=sistema_substituicao_aulas
SESSION_SECRET=sua-chave-secreta-super-segura
GMAIL_USER=seu-email@gmail.com
GMAIL_PASS=sua-senha-de-app
SEGMENT_WRITE_KEY=sua-chave-do-segment

# 3. Configure as configurações de build:
# Build Command: npm install
# Start Command: npm start
```

### Variáveis de Ambiente no Render
No painel do Render, adicione as seguintes variáveis:
- `MONGODB_URI` - String de conexão do MongoDB Atlas
- `DB_NAME` - Nome do banco de dados
- `SESSION_SECRET` - Chave secreta para sessões
- `GMAIL_USER` - Email para envio de notificações
- `GMAIL_PASS` - Senha de app do Gmail
- `SEGMENT_WRITE_KEY` - Chave do Segment Analytics
- `NODE_ENV` - production

### Docker (Opcional)
```bash
# Build da imagem
docker build -t api-substituicao-aulas .

# Executar container
docker run -p 3000:3000 api-substituicao-aulas
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### 📝 Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação, sem mudanças de código
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/Masterbarreto/api-mongo/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente

## 📞 Suporte
- 🐛 Issues: [GitHub Issues](https://github.com/Masterbarreto/api-mongo/issues)

## 📄 Licença

Este projeto está licenciado sob a **Licença ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

Feito com ❤️ por [Pedro Henrique Vieira Barreto](https://github.com/Masterbarreto)

</div>