# API Mongo - Sistema de Substituição de Aulas

Este projeto é uma API desenvolvida em Node.js utilizando MongoDB como banco de dados. A API é responsável por gerenciar usuários, sessões e atividades relacionadas ao sistema de substituição de aulas.

## Funcionalidades

- **Cadastro de Usuários**: Permite criar novos usuários no sistema.
- **Login de Usuários**: Autenticação de usuários com validação de credenciais.
- **Logout de Usuários**: Finaliza a sessão de um usuário.
- **Registro de Atividades**: Registra ações realizadas pelos usuários.
- **Recuperação de Atividades**: Permite consultar as atividades realizadas por um usuário.
- **Redefinição de Senha**: Permite redefinir a senha de um usuário.
- **Verificação de Conta**: Verifica a conta do usuário através de um código.

## Estrutura do Projeto

### Principais Diretórios

- **controllers/**: Contém os controladores responsáveis pela lógica de negócio.
- **models/**: Contém os modelos do MongoDB.
- **routes/**: Define as rotas da API.
- **public/**: Contém páginas HTML para feedback ao usuário.
- **server/**: Configuração do servidor Express.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para criação de APIs.
- **MongoDB**: Banco de dados NoSQL.
- **Yup**: Validação de dados.
- **Bcrypt**: Criptografia de senhas.
- **Swagger**: Documentação da API.
- **Chalk**: Estilização de logs no console.

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/api-mongo.git
   cd api-mongo
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:
   ```env
   MONGODB_URI=<sua-uri-do-mongodb>
   DB_NAME=<nome-do-banco>
   API_VERSION=/api/v1
   PORT=3000
   ```

## Uso

1. **Inicie o servidor**:
   ```bash
   npm start
   ```

2. **Acesse a API**:
   O servidor estará disponível em: [http://localhost:3000](http://localhost:3000).

## Rotas Principais

### Usuários
- **Cadastro de Usuários**:  
  `POST /api/v1/users/register`  
  Permite criar novos usuários no sistema.

- **Login de Usuários**:  
  `POST /api/v1/users/login`  
  Autentica usuários com validação de credenciais.

- **Logout de Usuários**:  
  `DELETE /api/v1/users/logout/:id`  
  Finaliza a sessão de um usuário.

- **Registro de Atividades**:  
  `POST /api/v1/users/activity`  
  Registra ações realizadas pelos usuários.

- **Recuperação de Atividades**:  
  `GET /api/v1/users/activity/:userId`  
  Consulta as atividades realizadas por um usuário.

- **Redefinição de Senha**:  
  `POST /api/v1/users/reset-password`  
  Permite redefinir a senha de um usuário.

## Documentação

Acesse a documentação da API em [http://localhost:3000/docs](http://localhost:3000/docs).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença ISC.