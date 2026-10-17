# Finalizacao da atividade

## O que ja esta preparado
Backend completo, contrato REST e texto da Issue #1, AGENTS.md, SQL, seeds e testes.

## Publicacao GitHub
Crie um repositorio vazio chamado estudai-api, envie os arquivos e crie sua primeira Issue usando docs/ISSUE-01.md (titulo: Estudai - MVP individual e contrato da API REST). Use o numero real retornado pelo GitHub; nao invente o link.

Sugestao de commits:
- :tada: feat: cria MVP individual Estudai com contrato REST e Supabase
- :white_check_mark: test: valida contrato HTTP e prepara integracao Supabase
- :memo: docs: registra especificacao e entrega da Aula 10

## Evidencia em nuvem
1. Execute o SQL em projeto Supabase de demonstracao.
2. Preencha o .env local, sem envia-lo ao GitHub.
3. Execute npm run test:cloud e guarde a saida real.
4. Com npm start ativo, execute no PowerShell (use curl.exe):

```powershell
curl.exe -i http://localhost:3000/api/v1/tarefas
```

Salve o JSON de exemplo de docs/ISSUE-01.md como payload.json e rode:
```powershell
curl.exe -i -X POST http://localhost:3000/api/v1/tarefas -H "Content-Type: application/json" --data-binary "@payload.json"
```
Copie a URI real do Location para testar GET, PUT e DELETE. Registre 201/Location e linha no Table Editor; registre 204 com corpo vazio e 400 para JSON invalido. Nao fotografar chaves nem .env.

## Classroom
Cole o link real da Issue #1 em Seus trabalhos > Adicionar ou criar > Link (ou campo de resposta que a plataforma disponibilizar). Depois marque a atividade como concluida.

## Estado honesto
Sem URL de repositorio/Issue e sem evidencia executada no Supabase, a entrega ainda esta pendente de publicacao e demonstracao em nuvem. Nao marcar esses itens como realizados apenas por haver codigo preparado.
