const {test}=require('node:test');
const assert=require('node:assert/strict');
const request=require('supertest');
const createClient=require('../src/config/supabase');
const createRepo=require('../src/repositories/tarefas');
const createApp=require('../src/app');
test('persistencia real no Supabase e CHECK do PostgreSQL',async()=>{
 const client=createClient();const repo=createRepo(client);const api=request(createApp(repo));let id;
 const body={titulo:'Evidencia automatizada',disciplina:'TEC.1053',descricao:'Registro ficticio de teste, removido ao final.',prazo:'2026-10-25',status:'pendente'};
 try {
  const r=await api.post('/api/v1/tarefas').send(body).expect(201);id=r.body.id;
  const otherClient=createClient();const {data,error}=await otherClient.from('tarefas').select('*').eq('id',id).single();assert.ifError(error);assert.equal(data.titulo,body.titulo);
  await request(createApp(createRepo(otherClient))).get(r.headers.location).expect(200);
  const invalid=await client.from('tarefas').insert({...body,status:'INVALIDO'});assert.equal(invalid.error?.code,'23514');
  await api.put(r.headers.location).send({...body,status:'concluida'}).expect(200);
  const malformed=await api.post('/api/v1/tarefas').set('Content-Type','application/json').send('{');assert.equal(malformed.status,400);
  const d=await api.delete(r.headers.location).expect(204);assert.equal(d.text,'');await api.get(r.headers.location).expect(404);
 } finally {if(id) {const {error}=await client.from('tarefas').delete().eq('id',id);assert.ifError(error);}}
});
