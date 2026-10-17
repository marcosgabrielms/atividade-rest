const { Router } = require('express');
const controller = require('../controllers/tarefas');
module.exports = function routes(repo) {
  const router=Router(); const c=controller(repo);
  router.route('/').get(c.list).post(c.body,c.create);
  router.route('/:id').all(c.id).get(c.find).put(c.body,c.replace).delete(c.remove);
  return router;
};
