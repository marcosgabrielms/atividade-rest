# Estudai: especificacao do MVP e contrato da API REST

## Identificacao
- Disciplina: Topicos Especiais em Programacao (TEC.1053), IFPI, 2026/2.
- Equipe individual: **Marcos Gabriel**.
- Produto: **Estudai**, organizador de tarefas academicas.

## Problema, publico e escopo
Estudantes recebem tarefas em diferentes canais e podem perder prazos. O MVP centraliza titulo, disciplina, descricao, prazo e andamento em uma API consumivel por futuros clientes web/mobile.
Inclui criar, listar, consultar, substituir e excluir tarefas. Exclui notificacoes, anexos, integracao com Classroom e IA em producao. A IA auxilia a engenharia; o contrato, os testes e o PostgreSQL validam o resultado.

## Cenarios BDD
1. Dado um payload completo valido, quando cadastrar uma tarefa, entao retornar 201, Location e registro persistido.
2. Dada uma colecao, quando consultar por GET, entao retornar 200 com array sem modificar dados.
3. Dado um UUID ausente, quando consultar ou substituir, entao retornar 404.
4. Dada uma tarefa, quando substituir todos os campos duas vezes pelo mesmo payload, entao o estado final sera igual.
5. Dada uma tarefa, quando excluir duas vezes, entao retornar 204 sem corpo e manter o recurso ausente.
6. Dado JSON malformado ou payload invalido, quando cadastrar, entao retornar 400 sem inserir registros.

## Contrato de comunicacao
Base: `/api/v1`. Representacao: `application/json`. Cache: `Cache-Control: no-store`.

| Metodo | URI | Finalidade | Entrada | Sucesso | Erros |
|---|---|---|---|---|---|
| POST | /tarefas | Criar | Objeto completo abaixo | 201 + Location + tarefa | 400, 413, 500 |
| GET | /tarefas | Listar | Sem corpo | 200 + array (vazio: []) | 500 |
| GET | /tarefas/{id} | Consultar UUID | Sem corpo | 200 + tarefa | 400, 404, 500 |
| PUT | /tarefas/{id} | Substituir campos editaveis | Objeto completo abaixo | 200 + tarefa | 400, 404, 413, 500 |
| DELETE | /tarefas/{id} | Excluir | Sem corpo | 204 sem corpo, inclusive ausente | 400, 500 |

GET e seguro e idempotente; PUT e DELETE sao idempotentes. POST repetido cria recursos distintos. PUT nao faz upsert: UUID ausente retorna 404. Datas passadas sao permitidas para registrar pendencias atrasadas.

### Payload de POST e PUT
Todos os cinco campos sao obrigatorios. Campos adicionais sao rejeitados, inclusive id e created_at. PUT exige substituicao completa dos campos editaveis, preservando id e created_at.
```json
{
  "titulo": "Revisar arquitetura REST",
  "disciplina": "Topicos Especiais em Programacao",
  "descricao": "Estudar metodos HTTP e revisar o contrato da API.",
  "prazo": "2026-10-25",
  "status": "pendente"
}
```
Validacao: titulo 1-120 caracteres, disciplina 1-80, descricao 1-2000, todos contendo texto nao branco; prazo e uma data real AAAA-MM-DD; status pertence a pendente, em_andamento ou concluida. Corpo limitado a 16 KiB.

### Resposta de criacao e consulta
POST retorna `201 Created` e `Location: /api/v1/tarefas/11111111-1111-4111-8111-111111111111`.
```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "titulo": "Revisar arquitetura REST",
  "disciplina": "Topicos Especiais em Programacao",
  "descricao": "Estudar metodos HTTP e revisar o contrato da API.",
  "prazo": "2026-10-25",
  "status": "pendente",
  "created_at": "2026-10-17T14:00:00Z",
  "links": [
    {"rel":"self","href":"/api/v1/tarefas/11111111-1111-4111-8111-111111111111","method":"GET"},
    {"rel":"collection","href":"/api/v1/tarefas","method":"GET"},
    {"rel":"replace","href":"/api/v1/tarefas/11111111-1111-4111-8111-111111111111","method":"PUT"},
    {"rel":"delete","href":"/api/v1/tarefas/11111111-1111-4111-8111-111111111111","method":"DELETE"}
  ]
}
```
Listagem retorna array dessas representacoes. Exemplo de erro 404:
```json
{"erro":"Tarefa nao encontrada."}
```
DELETE retorna corpo com zero bytes. Erros nunca retornam HTTP 200. UUID invalido recebe 400.

## Arquitetura e persistencia
Node.js + Express; routes -> controllers -> repositories -> cliente Supabase (config). O app e separado do listener para testes. Persistencia em PostgreSQL via SDK oficial HTTPS. SQL em supabase/schema.sql, com UUID, data de criacao, NOT NULL e CHECK. Sem sessoes no servidor; cada requisicao contem os dados necessarios. Links hipermidia indicam operacoes disponiveis. Codigo sob demanda nao e usado (restricao opcional).

## Seguranca da demonstracao
.env e ignorado, .env.example sem credenciais, sem service_role. A configuracao da Aula 10 permite CRUD anonimo somente em dados ficticios de demonstracao: RLS habilitado com politicas publicas nao equivale a isolamento por usuario. JWT/RLS por proprietario e evolucao da Aula 11.

## Evidencias e acompanhamento
- [x] Contrato, cenarios BDD, backend em camadas e AGENTS.md preparados.
- [x] SQL de demonstracao e teste de integracao real preparados.
- [ ] Executar SQL em projeto Supabase e registrar URL publica do projeto (sem chaves).
- [ ] Executar npm run test:cloud e registrar resultado real.
- [ ] Publicar este repositorio e usar este texto na primeira Issue (#1).
- [ ] Registrar link direto da Issue no Classroom e marcar como concluida.

Resultados locais: consultar evidencias/testes.txt. Nao confundir testes com duble de repositorio com comprovacao de persistencia na nuvem.

## Referencias da atividade
- Sousa, A. R. R.; Almeida, W. H. C. Desenvolvendo Aplicacoes RESTFul utilizando Node.js. ERIPI 2017, cap. 15, p. 532-548.
- Apostila Aula 10 - Estilo Arquitetural REST, Protocolo HTTP e Engenharia com IA (06/10/2026).
- Slides Aula 10 - REST e MVP ao vivo (06/10/2026).
- Tutorial Aula 10 - Construcao de MVP RESTful com Supabase e IA ao Vivo.
