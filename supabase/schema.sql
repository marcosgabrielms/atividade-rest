-- Executar somente em um projeto de demonstracao. Dados ficticios publicos.
begin;
create table if not exists public.tarefas (
 id uuid primary key default gen_random_uuid(),
 titulo varchar(120) not null check (length(trim(titulo)) > 0),
 disciplina varchar(80) not null check (length(trim(disciplina)) > 0),
 descricao text not null check (length(trim(descricao)) > 0 and length(descricao) <= 2000),
 prazo date not null,
 status varchar(20) not null check (status in ('pendente','em_andamento','concluida')),
 created_at timestamptz not null default now()
);
alter table public.tarefas enable row level security;
grant usage on schema public to anon;
grant select, insert, update, delete on public.tarefas to anon;
drop policy if exists demonstracao_leitura on public.tarefas;
drop policy if exists demonstracao_insercao on public.tarefas;
drop policy if exists demonstracao_atualizacao on public.tarefas;
drop policy if exists demonstracao_remocao on public.tarefas;
create policy demonstracao_leitura on public.tarefas for select to anon using (true);
create policy demonstracao_insercao on public.tarefas for insert to anon with check (true);
create policy demonstracao_atualizacao on public.tarefas for update to anon using (true) with check (true);
create policy demonstracao_remocao on public.tarefas for delete to anon using (true);
insert into public.tarefas(id,titulo,disciplina,descricao,prazo,status) values
 ('11111111-1111-4111-8111-111111111111','Revisar REST','Topicos Especiais em Programacao','Estudar metodos e status HTTP.','2026-10-25','pendente'),
 ('22222222-2222-4222-8222-222222222222','Praticar SQL','Banco de Dados','Revisar restricoes CHECK.','2026-10-26','em_andamento')
on conflict (id) do nothing;
commit;
