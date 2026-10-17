const express = require('express');
module.exports = function createApp(repo) {
  const app=express();
  app.disable('x-powered-by');
  app.use((req,res,next) => { res.set('Cache-Control','no-store'); next(); });
  app.use(express.json({limit:'16kb', strict:true}));
  app.use('/api/v1/tarefas',require('./routes/tarefas')(repo));
  app.use((req,res) => res.status(404).json({erro:'Rota nao encontrada.'}));
  app.use((err,req,res,next) => {
    if (res.headersSent) return next(err);
    const status = err.type === 'entity.parse.failed' ? 400 : err.type === 'entity.too.large' ? 413 : 500;
    res.status(status).json({erro:status===400?'JSON malformado.':status===413?'Corpo excede 16 KiB.':'Falha interna ao processar a requisicao.'});
  });
  return app;
};
