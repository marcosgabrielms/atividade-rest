# Atividade REST

Atividade da Aula 10 de **Tópicos Especiais em Programação — IFPI**.

**Aluno:** Marcos Gabriel · **Equipe:** individual.

O projeto Estudaí é uma API para organizar tarefas acadêmicas. Permite cadastrar, listar, consultar, atualizar e excluir tarefas, usando Node.js, Express e PostgreSQL no Supabase.

## Como executar

Requer Node.js 22 ou superior e um projeto de demonstração no Supabase.

1. Instale as dependências com `npm ci`.
2. Execute o arquivo `supabase/schema.sql` no SQL Editor do Supabase.
3. Copie `.env.example` para `.env` e preencha a URL e a chave anon do projeto.
4. Inicie a API com `npm start`.

Endereço local: `http://localhost:3000/api/v1/tarefas`.

## Rotas

| Método | Rota | Resultado |
|---|---|---|
| POST | /api/v1/tarefas | Cria tarefa: 201 com Location |
| GET | /api/v1/tarefas | Lista tarefas: 200 |
| GET | /api/v1/tarefas/{id} | Consulta tarefa: 200 ou 404 |
| PUT | /api/v1/tarefas/{id} | Substitui tarefa: 200 ou 404 |
| DELETE | /api/v1/tarefas/{id} | Exclui tarefa: 204 sem corpo |

O contrato completo e os exemplos JSON estão em [docs/ISSUE-01.md](docs/ISSUE-01.md).

## Testes

- `npm test`: verifica o contrato HTTP localmente, sem acessar o banco.
- `npm run test:cloud`: verifica a persistência real no Supabase configurado no `.env`.

Os 12 testes locais passaram. A evidência está em [evidencias/testes.txt](evidencias/testes.txt).

## Organização

- `src/routes`: rotas; `src/controllers`: validação e respostas HTTP.
- `src/repositories`: acesso ao banco; `src/config`: configuração do Supabase.
- `supabase`: SQL; `test`: testes; `docs`: especificação e contrato.

O `.env` está protegido pelo `.gitignore`. As políticas públicas do banco seguem a demonstração da Aula 10: use apenas dados fictícios. Autenticação e isolamento por usuário ficam para a próxima etapa.
