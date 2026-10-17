# Especificacao individual - Estudai
**Responsavel:** Marcos Gabriel. **Disciplina:** TEC.1053, IFPI, 2026/2.

## Visao
Centralizar atividades academicas e seu andamento para reduzir esquecimento de prazos. Publico: estudantes que recebem tarefas por diferentes canais.

## Recorte do MVP
Um recurso: tarefa academica. CRUD com titulo, disciplina, descricao, prazo e status. Interface desta etapa: API HTTP acessada por curl/Postman. Sem cliente visual, anexos, lembretes automaticos ou integracao Classroom.

## Regras de negocio
- Estado: pendente, em_andamento ou concluida; alteravel por substituicao completa.
- Prazo: data civil, sem horario/fuso; pode ser passado para representar atrasos.
- Identidade UUID e data de criacao geradas no banco e imutaveis na API.
- Tarefas com mesmo titulo sao permitidas.
- Excluir remove fisicamente a tarefa.

## Aceite
201 com Location na criacao; 200 nas leituras e substituicao; 204 sem corpo na exclusao; 400 para entrada invalida; 404 no GET/PUT ausente; PUT/DELETE idempotentes. Persistencia real demonstrada separadamente dos testes locais.

## Governanca
Contrato na Issue #1, regras em AGENTS.md e banco com restricoes deterministicas. A IA auxilia a geracao; testes e PostgreSQL verificam. Equipe composta somente por Marcos Gabriel.
