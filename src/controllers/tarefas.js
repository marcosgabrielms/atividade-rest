const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fields = ['titulo', 'disciplina', 'descricao', 'prazo', 'status'];
function valid(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  if (Object.keys(body).length !== fields.length || fields.some(k => !Object.hasOwn(body, k))) return false;
  for (const [k, max] of [['titulo',120], ['disciplina',80], ['descricao',2000]]) {
    if (typeof body[k] !== 'string' || !body[k].trim() || body[k].length > max) return false;
  }
  if (!['pendente','em_andamento','concluida'].includes(body.status)) return false;
  if (typeof body.prazo !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.prazo)) return false;
  const date = new Date(body.prazo + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === body.prazo && body.prazo.slice(0,4) !== '0000';
}
function representation(data) {
  return { ...data, links: [
    { rel: 'self', href: `/api/v1/tarefas/${data.id}`, method: 'GET' },
    { rel: 'collection', href: '/api/v1/tarefas', method: 'GET' },
    { rel: 'replace', href: `/api/v1/tarefas/${data.id}`, method: 'PUT' },
    { rel: 'delete', href: `/api/v1/tarefas/${data.id}`, method: 'DELETE' }
  ] };
}
module.exports = function controller(repo) {
  return {
    id(req,res,next) { if (!UUID.test(req.params.id)) return res.status(400).json({erro:'ID deve ser UUID.'}); next(); },
    body(req,res,next) { if (!valid(req.body)) return res.status(400).json({erro:'Informe somente titulo, disciplina, descricao, prazo (AAAA-MM-DD) e status validos.'}); next(); },
    async create(req,res) { const data = await repo.create(req.body); res.location(`/api/v1/tarefas/${data.id}`).status(201).json(representation(data)); },
    async list(req,res) { res.json((await repo.list()).map(representation)); },
    async find(req,res) { const data=await repo.find(req.params.id); if (!data) return res.status(404).json({erro:'Tarefa nao encontrada.'}); res.json(representation(data)); },
    async replace(req,res) { const data=await repo.replace(req.params.id,req.body); if (!data) return res.status(404).json({erro:'Tarefa nao encontrada.'}); res.json(representation(data)); },
    async remove(req,res) { await repo.remove(req.params.id); res.status(204).end(); }
  };
};
