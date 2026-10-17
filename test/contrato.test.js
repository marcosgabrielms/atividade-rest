const {test}=require('node:test');
const assert=require('node:assert/strict');
const request=require('supertest');
const {randomUUID}=require('node:crypto');
const createApp=require('../src/app');
const payload={titulo:'Estudar REST',disciplina:'TEC.1053',descricao:'Revisar contrato HTTP',prazo:'2026-10-25',status:'pendente'};
function setup(fail=false) {
 const rows=new Map();
 const repo={
  async create(body){if(fail)throw new Error('segredo interno');const row={...body,id:randomUUID(),created_at:'2026-10-17T00:00:00Z'}; rows.set(row.id,row);return row;},
  async list(){return [...rows.values()];}, async find(id){return rows.get(id)||null;},
  async replace(id,body){if(!rows.has(id))return null; const row={...rows.get(id),...body};rows.set(id,row);return row;},
  async remove(id){rows.delete(id);}
 };
 return {api:request(createApp(repo)),rows};
}
test('POST retorna 201, Location recuperavel e links',async()=>{const {api}=setup();const r=await api.post('/api/v1/tarefas').send(payload).expect(201);assert.equal(r.headers.location,`/api/v1/tarefas/${r.body.id}`);assert.equal(r.body.links.length,4);await api.get(r.headers.location).expect(200);});
test('GET lista array vazio sem alterar dados e informa cache',async()=>{const {api,rows}=setup();const r=await api.get('/api/v1/tarefas').expect(200);assert.deepEqual(r.body,[]);assert.equal(rows.size,0);assert.equal(r.headers['cache-control'],'no-store');});
test('GET repetido preserva recurso',async()=>{const {api,rows}=setup();const r=await api.post('/api/v1/tarefas').send(payload);const a=await api.get(r.headers.location);const b=await api.get(r.headers.location);assert.deepEqual(a.body,b.body);assert.equal(rows.size,1);});
test('GET e PUT inexistentes retornam 404',async()=>{const {api}=setup();const path=`/api/v1/tarefas/${randomUUID()}`;await api.get(path).expect(404);await api.put(path).send(payload).expect(404);});
test('UUID invalido retorna 400',async()=>{const {api}=setup();await api.get('/api/v1/tarefas/invalido').expect(400);});
test('payloads vazios, tipos errados, data impossivel e campos extras retornam 400',async()=>{const {api}=setup();for(const body of [{},[],{...payload,titulo:1},{...payload,titulo:'  '},{...payload,prazo:'2026-02-30'},{...payload,status:'invalido'},{...payload,id:randomUUID()}])await api.post('/api/v1/tarefas').send(body).expect(400);});
test('JSON malformado retorna 400',async()=>{const {api}=setup();await api.post('/api/v1/tarefas').set('Content-Type','application/json').send('{').expect(400);});
test('PUT exige representacao completa e e idempotente',async()=>{const {api,rows}=setup();const r=await api.post('/api/v1/tarefas').send(payload);await api.put(r.headers.location).send({status:'concluida'}).expect(400);const body={...payload,status:'concluida'};const a=await api.put(r.headers.location).send(body).expect(200);const b=await api.put(r.headers.location).send(body).expect(200);assert.deepEqual(a.body,b.body);assert.equal(rows.size,1);});
test('DELETE repetido retorna 204 sem corpo e GET posterior 404',async()=>{const {api,rows}=setup();const r=await api.post('/api/v1/tarefas').send(payload);for(let i=0;i<2;i++){const d=await api.delete(r.headers.location).expect(204);assert.equal(d.text,'');}assert.equal(rows.size,0);await api.get(r.headers.location).expect(404);});
test('erro interno retorna 500 sem vazar mensagem',async()=>{const {api}=setup(true);const r=await api.post('/api/v1/tarefas').send(payload).expect(500);assert.ok(!r.text.includes('segredo'));});
test('POST repetido cria recursos distintos',async()=>{const {api,rows}=setup();const a=await api.post('/api/v1/tarefas').send(payload);const b=await api.post('/api/v1/tarefas').send(payload);assert.notEqual(a.body.id,b.body.id);assert.equal(rows.size,2);});
test('GET de rota verbal nao remove recursos',async()=>{const {api,rows}=setup();await api.post('/api/v1/tarefas').send(payload);await api.get('/api/v1/excluir-tarefa').expect(404);assert.equal(rows.size,1);});
