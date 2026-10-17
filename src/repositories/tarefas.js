module.exports = function tarefasRepository(client) {
  async function result(query) {
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
  return {
    create: body => result(client.from('tarefas').insert(body).select().single()),
    list: () => result(client.from('tarefas').select('*').order('created_at', { ascending: false }).order('id')),
    find: id => result(client.from('tarefas').select('*').eq('id', id).maybeSingle()),
    replace: (id, body) => result(client.from('tarefas').update(body).eq('id', id).select().maybeSingle()),
    remove: id => result(client.from('tarefas').delete().eq('id', id))
  };
};
